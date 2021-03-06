import { AssetsRepository } from './../assets/repositories/assets.repository';
import { WalletsRepository } from './repositories/wallets.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { UsersRepository } from './repositories/users.repository';
import { WalletsService } from './services/wallets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository,
      WalletsRepository,
      AssetsRepository,
    ]),
  ],
  providers: [UsersResolver, UsersService, WalletsService],
  exports: [
    TypeOrmModule.forFeature([UsersRepository, WalletsRepository]),
    UsersService,
    WalletsService,
  ],
})
export class UsersModule {}
