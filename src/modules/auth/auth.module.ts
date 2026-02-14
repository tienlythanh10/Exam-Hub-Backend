import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from 'src/shared/database/typeorm.module';

@Module({
  imports: [ConfigModule.forRoot({}), JwtModule.register({}), TypeOrmModule],
  providers: [],
  controllers: [],
})
export class AuthModule {}
