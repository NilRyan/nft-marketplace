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
import { BaseModel } from '../../common/models/base.model';
import Gender from '../enums/gender.enum';
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
  @Column({ type: 'date' })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @OneToMany(() => AssetEntity, (asset) => asset.owner, {
    cascade: true,
  })
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
