import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { parse } from 'path';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/shared/database/entities/user.entity';
import { SignUpDTO } from '../dto/sign-up.dto';
import { HttpResponse } from 'src/shared/dto/http-response.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { TokenService } from './token.service';
import { TokenType } from 'src/shared/database/entities/token.entity';
import { RabbitProducerService } from 'src/modules/rabbitmq/services/producer.service';
import { NotificationType } from 'src/shared/dto/queue.dto';
import { VerifyAccountDTO } from '../dto/verify-account.dto';
import { SignInDTO } from '../dto/sign-in.dto';
import { JWTPayloadDTO } from '../dto/jwt.dto';
import { CustomJwtService } from './jwt.service';
import { ResetPasswordDTO } from '../dto/reset-password.dto';
import { EmailOtpRequestDTO, VerifyOtpDTO } from '../dto/otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly jwtService: CustomJwtService,
    private readonly rabbitMQProducer: RabbitProducerService,
  ) {}

  /*
   * Sign Up
   */
  async signUp(signUpData: SignUpDTO): Promise<HttpResponse> {
    let user = await this.authRepository.findUserByEmail(signUpData.email);

    if (user) {
      return {
        status: 409,
        success: false,
        message: 'Email đã được sử dụng. Vui lòng dùng email khác',
      };
    }

    let hashPassword = await bcrypt.hash(signUpData.password, 10);
    signUpData.password = hashPassword;

    const response = await this.authRepository.createUserAndProfile(signUpData);

    /*
     * Failed to create this account
     */
    if (response.success == false) {
      return {
        status: 500,
        success: false,
        message: response.message,
      };
    }

    const profile = response.data?.profile;
    let rawToken = this.tokenService.generateHexToken();
    const hashToken = this.tokenService.hashToken(rawToken);
    const now = new Date();

    await this.authRepository.createToken(
      hashToken,
      now,
      new Date(now.getTime() + 24 * 60 * 60 * 1000),
      TokenType.VERIFY_ACCOUNT,
      profile.userId,
    );

    this.rabbitMQProducer.publishMessageToEmailQueue({
      email: signUpData.email,
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      type: NotificationType.VERIFY_ACCOUNT,
      token: rawToken,
      userId: profile.userId,
    });

    return {
      status: 200,
      success: true,
      data: profile,
    };
  }

  /*
   * Verify Account
   * */
  async verifyAccount(
    verifyAccountData: VerifyAccountDTO,
  ): Promise<HttpResponse> {
    let hashToken = this.tokenService.hashToken(verifyAccountData.token);

    let tokenRecord = await this.authRepository.findToken(
      hashToken,
      TokenType.VERIFY_ACCOUNT,
      verifyAccountData.userId,
    );

    if (!tokenRecord) {
      return {
        status: 404,
        success: false,
        message: 'Liên kết xác thực không hợp lệ',
      };
    }

    if (tokenRecord.usedAt != null) {
      return {
        status: 400,
        success: false,
        message: 'Liên kết xác thực đã được sử dụng',
      };
    }

    if (tokenRecord.expiredAt < new Date()) {
      /* Revoke current token */

      tokenRecord.isRevoked = true;
      await this.authRepository.updateToken(tokenRecord);
      return {
        status: 400,
        success: false,
        message: 'Liên kết xác thực đã hết hạn',
      };
    }

    let user = await this.authRepository.findUserById(verifyAccountData.userId);

    if (user) {
      user.isVerified = true;
      user.verifiedAt = new Date();
      await this.authRepository.updateUser(user);
      tokenRecord.usedAt = new Date();

      await this.authRepository.updateToken(tokenRecord);
    }

    return {
      status: 200,
      success: true,
      data: user,
    };
  }

  /*
   * Sign In
   */
  async signIn(signInData: SignInDTO): Promise<HttpResponse> {
    const user = await this.authRepository.findUserByEmail(signInData.email);

    if (user == null) {
      return {
        status: 404,
        success: false,
        message: 'Tài khoản không tồn tại. Vui lòng kiểm tra lại email',
      };
    }

    if (user.isVerified == null) {
      return {
        status: 400,
        success: false,
        message:
          'Vui lòng kiểm tra email & xác thực tài khoản trước khi đăng nhập',
      };
    }

    const isPasswordMatch = await bcrypt.compare(
      signInData.password,
      user.password,
    );

    if (isPasswordMatch == false) {
      return {
        status: 400,
        success: false,
        message: 'Mật khẩu không chính xác',
      };
    }

    const profile = await this.authRepository.findProfileByUserId(user.id);

    if (profile == null) {
      return {
        status: 404,
        success: false,
        message:
          'Hồ sơ người dùng không tồn tại. Vui lòng liên hệ bộ phận hỗ trợ',
      };
    }

    const payload: JWTPayloadDTO = {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      role: user.role,
      userId: user.id,
    };
    const { accessToken, refreshToken } =
      this.jwtService.generateToken(payload);

    await this.saveRefreshTokenToDb(refreshToken, user);

    return {
      status: 200,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  async generateNewOtp(
    requestOtpData: EmailOtpRequestDTO,
  ): Promise<HttpResponse> {
    /*
     * When a user requests a new OTP by email, the backend should:
     * Not leak whether the email exists
     * Rate-limit OTP requests (5 per 15 minutes)
     * Revoke previous OTP token records with the same token type
     * Generate + hash OTP and store in DB with expiry
     * Increment rate-limit counter in Redis
     * Send OTP via email asynchronously (RabbitMQ)
     * Return an encrypted “multi-step token” for the next step
     */
    return {
      status: 200,
      success: true,
      data: {},
    };
  }

  async verifyOtp(verifyOtpData: VerifyOtpDTO): Promise<HttpResponse> {
    /*
     * Validate the OTP entered by the user. The request includes:
     * an encrypted multi-step token (created during “request OTP” step) &the OTP code the user typed
     * If valid:
     * mark OTP token record as used
     * update multi-step-token payload
     * shorten payload expiry to a smaller window (1/3 of OTP expiry)
     * return a new encrypted token to be used in the next step (reset password
     */
    return {
      status: 200,
      success: true,
      data: {},
    };
  }

  async resetPassword(
    resetPasswordData: ResetPasswordDTO,
  ): Promise<HttpResponse> {
    return {
      status: 200,
      success: true,
      data: {},
    };
  }

  async saveRefreshTokenToDb(rawRefreshToken: string, user: User) {
    const now = new Date();
    const JWT_REFRESH_EXPIRES_IN_SECOND = parseInt(
      this.configService.get('JWT_REFRESH_EXPIRES_IN_SECOND') || '604800',
    );
    const refreshTokenExpiredAt = new Date(
      now.getTime() + JWT_REFRESH_EXPIRES_IN_SECOND * 1000,
    );
    const hashRefreshToken = this.tokenService.hashToken(rawRefreshToken);
    await this.authRepository.createToken(
      hashRefreshToken,
      now,
      refreshTokenExpiredAt,
      TokenType.REFRESH_TOKEN,
      user.id,
    );
  }
}
