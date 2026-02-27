import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TokenType {
  VERIFY_ACCOUNT = 'verify-account',
  OTP = 'otp',
  RESET_PASSWORD = 'reset-password',
  REFRESH_TOKEN = 'refresh-token'
}

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'expired_at',
    type: 'datetime',
  })
  expiredAt: Date;

  @Column({
    type: 'enum',
    enum: TokenType,
  })
  type: TokenType;

  @Column({
    name: 'used_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  usedAt?: Date;

  @Column({
    name: 'is_revoked',
    default: false,
  })
  isRevoked: boolean;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_Tokens_Users',
  })
  user: User;
}
