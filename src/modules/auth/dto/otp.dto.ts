import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';

export interface IOtpRequest {
  email?: string;
}

export class EmailOtpRequestDTO implements IOtpRequest {
  @IsEmail()
  email: string;
}

export class VerifyOtpDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumberString()
  @IsNotEmpty()
  @Matches(new RegExp('^[0-9]{6}$'), {
    message: 'OTP must be a 6-digit number',
  })
  otp: string;
}

export class MultiStepTokenPayloadDTO {
  userId: string;
  isOtpVerified: boolean;
  expiredAt: Date;
}
