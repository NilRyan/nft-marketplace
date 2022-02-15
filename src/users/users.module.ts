import { WalletRepository } from './repositories/wallets.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, WalletRepository])],
  providers: [UsersResolver, UsersService],
  exports: [TypeOrmModule.forFeature([UsersRepository]), UsersService],
})
export class UsersModule {}
