import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { BaseModel } from '../../common/models/base.model';
import { UserEntity } from '../../users/entities/user.entity';

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

  @ManyToOne((type) => AssetEntity, (asset) => asset.comments)
  asset: AssetEntity;

  @RelationId((comment: CommentEntity) => comment.asset)
  assetId: string;
}
