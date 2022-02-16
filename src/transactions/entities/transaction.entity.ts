import { UserEntity } from 'src/users/entities/user.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import Coin from 'src/users/enums/coin.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { WalletEntity } from 'src/users/entities/wallet.entity';
import { AssetEntity } from 'src/assets/entities/asset.entity';

@Entity('transactions')
export class TransactionEntity extends BaseModel {
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

  @ManyToOne((type) => WalletEntity)
  @JoinColumn()
  buyerWallet: WalletEntity;

  @ManyToOne((type) => WalletEntity)
  @JoinColumn()
  sellerWallet: WalletEntity;

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

  @RelationId((transaction: TransactionEntity) => transaction.buyerWallet)
  buyerWalletId: string;

  @RelationId((transaction: TransactionEntity) => transaction.sellerWallet)
  sellerWalletId: string;
}
