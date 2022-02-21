import { OrderBy } from '../../common/pagination-filtering/order-by.input';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { CommentNotFoundException } from '../exceptions/comment-not-found.exception';
import { CommentsRepository } from '../repositories/comments.repository';
import { AssetsService } from '../../assets/assets.service';
import { PaginationArgs } from '../../common/pagination-filtering/pagination.args';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly assetsService: AssetsService,
  ) {}

  async createComment(
    createCommentInput: CreateCommentInput,
    author: UserEntity,
  ) {
    const asset = await this.assetsService.getAssetById(
      createCommentInput.assetId,
    );
    if (!asset) throw new CommentNotFoundException(createCommentInput.assetId);

    return await this.commentRepository.createComment(
      createCommentInput,
      author,
      asset,
    );
  }

  async getPaginatedCommentsForAsset(
    assetId: string,
    pagination: PaginationArgs,
  ) {
    const { limit, offset, orderBy } = pagination;
    const { field, sortOrder } = orderBy as unknown as OrderBy;
    const [comments, count] = await this.commentRepository.findAndCount({
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

  async getCommentById(commentId: string) {
    return await this.commentRepository.findOne(commentId, {
      relations: ['author', 'asset'],
    });
  }

  async updateComment(
    updateCommentInput: UpdateCommentInput,
    user: UserEntity,
  ) {
    const { id } = updateCommentInput;
    const comment = await this.commentRepository.findOne(id);
    if (!comment) throw new CommentNotFoundException(id);

    await this.verifyUserIsAuthor(comment, user.id);

    await this.commentRepository.update(id, updateCommentInput);
    const updatedComment = await this.commentRepository.findOne(id, {
      relations: ['author', 'asset'],
    });

    return updatedComment;
  }

  async deleteComment(id: string, user: UserEntity) {
    const comment = await this.commentRepository.findOne(id);

    this.verifyUserIsAuthor(comment, user.id);
    if (!comment) throw new CommentNotFoundException(id);
    await this.commentRepository.delete(id);

    return comment;
  }

  private verifyUserIsAuthor(comment: CommentEntity, userId: string) {
    if (comment.authorId !== userId) {
      throw new UnauthorizedException(
        `You can't update comment with id: ${comment.id}`,
      );
    }
  }
}
