import { Exclude } from 'class-transformer';
import { NftEntity } from 'src/nft/entities/nft.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  aboutMe: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'bigint' })
  balance: string;

  @OneToMany(() => NftEntity, (nft) => nft.owner)
  nfts?: NftEntity[];
}
