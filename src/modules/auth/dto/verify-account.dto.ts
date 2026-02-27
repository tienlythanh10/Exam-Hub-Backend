import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VerifyAccountDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsUUID()
  userId: string;
}
