import { UserEntity } from 'src/users/entities/user.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('wallets')
export class WalletEntity extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 15, scale: 6, default: 20 })
  balance: number;

  @OneToOne((type) => UserEntity, (user) => user.wallet)
  owner: UserEntity;

  @RelationId((wallet: WalletEntity) => wallet.owner)
  ownerId: string;
}
