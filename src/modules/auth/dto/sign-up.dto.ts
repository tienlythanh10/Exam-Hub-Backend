import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignUpDTO {
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address',
    },
  )
  email: string;

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
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
