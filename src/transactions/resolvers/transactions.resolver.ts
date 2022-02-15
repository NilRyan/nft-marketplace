import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { TransactionOutput } from '../dto/transaction.output';
import { TransactionsService } from '../services/transactions.service';

@Resolver(() => TransactionOutput)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => TransactionOutput)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionsService.create(createTransactionInput);
  }

  @Query(() => [TransactionOutput], { name: 'transactions' })
  findAll() {
    return this.transactionsService.findAll();
  }

  @Query(() => TransactionOutput, { name: 'transaction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transactionsService.findOne(id);
  }

}
