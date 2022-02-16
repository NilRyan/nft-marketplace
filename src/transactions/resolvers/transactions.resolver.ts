import { UserEntity } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GetUser } from 'src/auth/get-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { TransactionOutput } from '../dto/transaction.output';
import { TransactionsService } from '../services/transactions.service';
@UseGuards(GqlAuthGuard)
@Resolver(() => TransactionOutput)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => TransactionOutput)
  buyAsset(
    @Args('assetId', { type: () => String }) assetId: string,
    @GetUser() user: UserEntity,
  ) {
    return this.transactionsService.buyAsset(assetId, user);
  }

  @Query(() => [TransactionOutput])
  viewTransactions(@GetUser() user: UserEntity) {
    return this.transactionsService.viewTransactions(user);
  }
}
