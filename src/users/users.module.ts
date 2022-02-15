import { WalletRepository } from './wallets.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, WalletRepository])],
  providers: [UsersResolver, UsersService],
  exports: [TypeOrmModule.forFeature([UsersRepository]), UsersService],
})
export class UsersModule {}
