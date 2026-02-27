import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(
    new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
    ),
    {
      message:
        'Valid password must be have at least 1 lowercase, 1 uppercase character, 1 number & at least 8 characters long',
    },
  )
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
