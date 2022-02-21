import { AssetEntity } from 'src/assets/entities/asset.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateCommentInput } from '../dto/create-comment.input';
import { CommentEntity } from '../entities/comment.entity';

@EntityRepository(CommentEntity)
export class CommentsRepository extends Repository<CommentEntity> {
  async createComment(
    createCommentInput: CreateCommentInput,
    author: UserEntity,
    asset: AssetEntity,
  ) {
    const newComment = this.create({
      ...createCommentInput,
      author,
      asset,
    });

    return await this.save(newComment);
  }
}
