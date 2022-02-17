import { CommentEntity } from 'src/comments/entities/comment.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('asset')
@Check('"price" >= 0')
export class AssetEntity extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'numeric', precision: 15, scale: 6, default: 0 })
  price: number;

  @Column({ default: null, type: 'timestamptz' })
  lastSale: Date;

  @Column()
  category: string;

  @ManyToOne((type) => UserEntity, (user) => user.assets)
  owner: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  creator: UserEntity;

  @RelationId((asset: AssetEntity) => asset.creator)
  creatorId: string;

  @RelationId((asset: AssetEntity) => asset.owner)
  ownerId: string;

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.asset, {
    nullable: true,
  })
  comments?: CommentEntity[];
}
