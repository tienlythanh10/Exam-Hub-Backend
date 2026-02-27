import { UserRole } from 'src/shared/database/entities/user.entity';

export class JWTPayloadDTO {
  userId: string;

  firstName: string;

  lastName: string;

  role: UserRole;
}
