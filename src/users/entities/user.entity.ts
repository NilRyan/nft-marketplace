import { Exclude } from 'class-transformer';
import Role from 'src/auth/enums/role.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { NftEntity } from 'src/nft/entities/nft.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
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

  @Column({ type: 'numeric', precision: 15, scale: 6, default: 20 })
  balance: number;

  @OneToMany(() => NftEntity, (nft) => nft.owner)
  nfts?: NftEntity[];

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;
}
