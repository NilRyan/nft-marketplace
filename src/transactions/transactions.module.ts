import { UsersRepository } from './../users/repositories/users.repository';
import { NftRepository } from './../nft/nft.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsResolver } from './resolvers/transactions.resolver';
import { TransactionsService } from './services/transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionRepository,
      NftRepository,
      UsersRepository,
    ]),
  ],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
