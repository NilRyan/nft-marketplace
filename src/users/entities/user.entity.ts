import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { AssetEntity } from '../../assets/entities/asset.entity';
import Role from '../../auth/enums/role.enum';
import { BaseModel } from '../../common/entities/base.entity';
import { WalletEntity } from './wallet.entity';

@Entity('users')
export class UserEntity extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  aboutMe: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => AssetEntity, (asset) => asset.owner)
  assets?: AssetEntity[];

  @OneToOne(() => WalletEntity)
  @JoinColumn()
  wallet?: WalletEntity;

  @RelationId((user: UserEntity) => user.wallet)
  walletId?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;
}
