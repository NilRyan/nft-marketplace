import { UpdateCommentInput } from './../dto/update-comment.input';
import { AssetEntity } from 'src/assets/entities/asset.entity';
import { EntityRepository, In, Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateCommentInput } from '../dto/create-comment.input';
import { CommentEntity } from '../entities/comment.entity';
import { PaginationArgs } from '../../common/pagination-filtering/pagination.args';
import { OrderBy } from '../../common/pagination-filtering/order-by.input';

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

  async updateComment(updateCommentInput: UpdateCommentInput) {
    await this.update(updateCommentInput.id, updateCommentInput);
    return await this.findOne(updateCommentInput.id, {
      relations: ['author', 'asset'],
    });
  }

  async getCommentsByAssetIds(assetIds: string[]) {
    const comments = await this.find({
      where: {
        asset: {
          id: In(assetIds),
        },
      },
    });
    return comments;
  }
  async getPaginatedCommentsForAsset(
    assetId: string,
    pagination: PaginationArgs,
  ) {
    const { limit, offset, orderBy } = pagination;
    const { field, direction: sortOrder } = orderBy as unknown as OrderBy;
    const [comments, count] = await this.findAndCount({
      where: {
        asset: {
          id: assetId,
        },
      },
      order: {
        [field]: sortOrder,
      },
      skip: offset,
      take: limit,
    });

    return {
      comments,
      paginationInfo: {
        total: count,
        limit,
        offset,
      },
    };
  }
}
