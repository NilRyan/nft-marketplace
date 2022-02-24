import { WalletsService } from './../users/services/wallets.service';
import { UsersModule } from './../users/users.module';
import { UsersRepository } from './../users/repositories/users.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsResolver } from './resolvers/transactions.resolver';
import { TransactionsService } from './services/transactions.service';
import { AssetsModule } from '../assets/assets.module';
import { AssetsRepository } from '../assets/repositories/assets.repository';

@Module({
  imports: [
    AssetsModule,
    UsersModule,
    TypeOrmModule.forFeature([
      TransactionRepository,
      AssetsRepository,
      UsersRepository,
    ]),
  ],
  providers: [TransactionsResolver, TransactionsService, WalletsService],
})
export class TransactionsModule {}
