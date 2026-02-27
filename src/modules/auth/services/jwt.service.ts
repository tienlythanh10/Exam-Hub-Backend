import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { JWTPayloadDTO } from '../dto/jwt.dto';
import { TokenService } from './token.service';

@Injectable()
export class CustomJwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  generateToken(payload: JWTPayloadDTO): {
    accessToken: string;
    refreshToken: string;
  } {
    let accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });
    let refreshToken = this.tokenService.generateHexToken();

    return {
      accessToken,
      refreshToken,
    };
  }

  verify(token: string, options?: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }
}
