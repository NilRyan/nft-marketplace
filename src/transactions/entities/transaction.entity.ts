import { NftEntity } from 'src/nft/entities/nft.entity';
import { Nft } from 'src/nft/models/nft.model';
import { BaseModel } from 'src/common/entities/base.entity';
import Coin from 'src/users/enums/coin.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { WalletEntity } from 'src/users/entities/wallet.entity';

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

  @ManyToOne((type) => NftEntity)
  @JoinColumn()
  nft: NftEntity;

  @RelationId((transaction: TransactionEntity) => transaction.nft)
  nftId: string;

  @ManyToOne((type) => WalletEntity)
  @JoinColumn()
  buyerWallet: WalletEntity;

  @ManyToOne((type) => WalletEntity)
  @JoinColumn()
  sellerWallet: WalletEntity;

  @RelationId((transaction: TransactionEntity) => transaction.buyerWallet)
  buyerWalletId: string;

  @RelationId((transaction: TransactionEntity) => transaction.sellerWallet)
  sellerWalletId: string;
}
