import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from 'src/shared/database/typeorm.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { RabbitProducerService } from '../rabbitmq/services/producer.service';
import { CustomRabbitModule } from '../rabbitmq/rabbitmq.module';
import { AuthRepository } from './repositories/auth.repository';
import { ProfileRepository } from '../profiles/repositories/profile.repository';
import { CustomJwtService } from './services/jwt.service';

@Module({
  imports: [
    JwtModule.register({
      privateKey: process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      signOptions: {
        algorithm: 'RS256',
      },
    }),
    TypeOrmModule,
    CustomRabbitModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    ProfileRepository,
    TokenService,
    CustomJwtService,
    RabbitProducerService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
