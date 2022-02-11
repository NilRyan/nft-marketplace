import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
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

  @Column()
  isDeleted: boolean;

  @Column()
  category: string;

  @ManyToOne((type) => User, (user) => user.nfts)
  owner: User;

  @RelationId((nft: NftEntity) => nft.owner)
  ownerId: string;

  @OneToMany(() => Comment, (comment: Comment) => comment.nft)
  comments: Comment[];
}
