import { ResolveField } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import Role from 'src/auth/enums/role.enum';
import { BaseModel } from 'src/common/entities/base.entity';
import { NftEntity } from 'src/nft/entities/nft.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
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

  @OneToMany(() => NftEntity, (nft) => nft.owner)
  nfts?: NftEntity[];

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
