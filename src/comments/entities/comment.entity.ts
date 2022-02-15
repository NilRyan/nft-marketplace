import { BaseModel } from 'src/common/entities/base.entity';
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
export class CommentEntity extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @ManyToOne((type) => UserEntity)
  author: UserEntity;

  @RelationId((comment: CommentEntity) => comment.author)
  authorId: string;

  @ManyToOne((type) => NftEntity, (nft) => nft.comments)
  nft: NftEntity;

  @RelationId((comment: CommentEntity) => comment.nft)
  nftId: string;
}
