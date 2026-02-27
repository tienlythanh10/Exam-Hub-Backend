import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address',
    },
  )
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
