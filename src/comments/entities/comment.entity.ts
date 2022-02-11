import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { NftEntity } from 'src/nft/entities/nft.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @ManyToOne((type) => UserEntity)
  user: UserEntity;

  @RelationId((comment: CommentEntity) => comment.user)
  userId: string;

  @ManyToOne((type) => NftEntity, (nft) => nft.comments)
  nft: NftEntity;

  @RelationId((comment: CommentEntity) => comment.nft)
  nftId: string;
}
