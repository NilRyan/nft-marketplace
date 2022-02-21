import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { UserEntity } from '../../users/entities/user.entity';
import Coin from '../../users/enums/coin.enum';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Coin,
    default: Coin.CalapeCoin,
  })
  coin: Coin;

  @Column({ type: 'numeric', precision: 15, scale: 6, default: 20 })
  amount: number;

  @ManyToOne((type) => AssetEntity)
  @JoinColumn()
  asset: AssetEntity;

  @RelationId((transaction: TransactionEntity) => transaction.asset)
  assetId: string;

  @ManyToOne((type) => UserEntity)
  @JoinColumn()
  buyer: UserEntity;

  @RelationId((transaction: TransactionEntity) => transaction.buyer)
  buyerId: string;

  @ManyToOne((type) => UserEntity)
  @JoinColumn()
  seller: UserEntity;

  @RelationId((transaction: TransactionEntity) => transaction.seller)
  sellerId: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
