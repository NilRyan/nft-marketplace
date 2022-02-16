import { AssetEntity } from 'src/assets/entities/asset.entity';
import { BaseModel } from 'src/common/entities/base.entity';
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

  @ManyToOne((type) => AssetEntity, (asset) => asset.comments)
  asset: AssetEntity;

  @RelationId((comment: CommentEntity) => comment.asset)
  assetId: string;
}
