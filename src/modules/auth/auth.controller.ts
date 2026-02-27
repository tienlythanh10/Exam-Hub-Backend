import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './services/auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { VerifyAccountDTO } from './dto/verify-account.dto';
import { SignInDTO } from './dto/sign-in.dto';
import { EmailOtpRequestDTO, VerifyOtpDTO } from './dto/otp.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpData: SignUpDTO, @Res() res: Response) {
    let response = await this.authService.signUp(signUpData);
    res.status(response.status).json({
      success: response.success,
      data: response.data,
      message: response.message,
    });
  }

  @Post('verify-account')
  async verifyAccount(
    @Body() verifyAccountData: VerifyAccountDTO,
    @Res() res: Response,
  ) {
    let response = await this.authService.verifyAccount(verifyAccountData);
    res.status(response.status).json({
      success: response.success,
      data: response.data,
      message: response.message,
    });
  }

  @Post('sign-in')
  async signIn(@Body() signInData: SignInDTO, @Res() res: Response) {
    let response = await this.authService.signIn(signInData);
    res.status(response.status).json({
      success: response.success,
      data: response.data,
      message: response.message,
    });
  }

  @Post('otp')
  async generateNewOtp(
    @Body() requestOtpData: EmailOtpRequestDTO,
    @Res() res: Response,
  ) {}

  @Post('otp/verify')
  async verifyOtp(@Body() verifyOtpData: VerifyOtpDTO, @Res() res: Response) {}

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordData: ResetPasswordDTO,
    @Res() res: Response,
  ) {}
}
