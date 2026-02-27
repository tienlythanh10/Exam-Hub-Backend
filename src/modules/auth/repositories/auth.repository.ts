import { Injectable } from '@nestjs/common';
import { Profile } from 'src/shared/database/entities/profile.entity';
import { Token, TokenType } from 'src/shared/database/entities/token.entity';
import { User, UserRole } from 'src/shared/database/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import e from 'express';
import { ProfileRepository } from 'src/modules/profiles/repositories/profile.repository';
import { SignUpDTO } from '../dto/sign-up.dto';
import { SqlTransactionResponse } from 'src/shared/dto/http-response.dto';

@Injectable()
export class AuthRepository {
  private userRepository: Repository<User>;
  private tokenRepository: Repository<Token>;

  constructor(
    private dataSource: DataSource,
    private readonly profileRepository: ProfileRepository,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
    this.tokenRepository = this.dataSource.getRepository(Token);
  }

  async createUserAndProfile(
    signUpData: SignUpDTO,
  ): Promise<SqlTransactionResponse> {
    const transaction = this.dataSource.createQueryRunner();

    // establish real database connection using our new query runner
    await transaction.connect();

    await transaction.startTransaction();

    try {
      const user = await this.createUser(signUpData.email, signUpData.password);
      const profile = await this.profileRepository.createProfile(
        user,
        signUpData.firstName,
        signUpData.lastName,
      );

      await transaction.commitTransaction();
      return {
        success: true,
        data: {
          profile: profile,
        },
      };
    } catch (error) {
      await transaction.rollbackTransaction();
      return {
        success: false,
        message: 'Đã có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại sau.',
      };
    } finally {
      await transaction.release();
    }
  }

  async createUser(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({
      email: email,
      password: password,
      createdAt: new Date(),
      role: UserRole.STUDENT,
    });

    return await this.userRepository.save(user);
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findProfileByUserId(userId: string): Promise<Profile | null> {
    return await this.profileRepository.findProfileByUserId(userId);
  }

  async createToken(
    hashToken: string,
    createdAt: Date,
    expiredAt: Date,
    tokenType: TokenType,
    userId: string,
  ): Promise<Token> {
    const token = this.tokenRepository.create({
      token: hashToken,
      createdAt: createdAt,
      expiredAt: expiredAt,
      type: tokenType,
      userId: userId,
    });

    return await this.tokenRepository.save(token);
  }

  async findToken(
    hashToken: string,
    tokenType: TokenType,
    userId?: string,
  ): Promise<Token | null> {
    return await this.tokenRepository.findOne({
      where: {
        token: hashToken,
        userId: userId,
        type: tokenType,
        isRevoked: false,
      },
    });
  }

  async updateToken(token: Token): Promise<Token> {
    return await this.tokenRepository.save(token);
  }
}
