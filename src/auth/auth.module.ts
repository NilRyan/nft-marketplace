import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/users/user.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    ConfigModule,
    UsersModule,
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
