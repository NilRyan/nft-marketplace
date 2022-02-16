import { UserEntity } from 'src/users/entities/user.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import Coin from '../enums/coin.enum';

@Entity('wallets')
@Check('"balance" >= 0')
export class WalletEntity extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 15, scale: 6, default: 10000 })
  balance: number;

  @OneToOne((type) => UserEntity, (user) => user.wallet)
  @JoinColumn()
  owner: UserEntity;

  @RelationId((wallet: WalletEntity) => wallet.owner)
  ownerId: string;

  @Column({ type: 'enum', enum: Coin, default: Coin.CalapeCoin })
  coin: Coin;
}
