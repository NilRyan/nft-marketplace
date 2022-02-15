import { EntityRepository, Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';

@EntityRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {
  async createTransaction(transactionData: TransactionEntity) {
    const newTransaction = this.create(transactionData);
    return await this.save(newTransaction);
  }
}
