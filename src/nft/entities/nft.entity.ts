import { CommentEntity } from 'src/comments/entities/comment.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('nft')
export class NftEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'bigint' })
  price: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  category?: string;

  @ManyToOne((type) => UserEntity, (user) => user.nfts)
  owner: UserEntity;

  @RelationId((nft: NftEntity) => nft.owner)
  ownerId: string;

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.nft, {
    nullable: true,
  })
  comments?: CommentEntity[];
}
