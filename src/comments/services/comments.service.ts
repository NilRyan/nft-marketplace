import { OrderBy } from '../../common/pagination-filtering/order-by.input';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { CommentNotFoundException } from '../exceptions/comment-not-found.exception';
import { CommentsRepository } from '../repositories/comments.repository';
import { AssetsService } from '../../assets/services/assets.service';
import { PaginationArgs } from '../../common/pagination-filtering/pagination.args';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../entities/comment.entity';
import { AssetNotFoundException } from '../../assets/exceptions/asset-not-found.exception';

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
    const asset = await this.assetsService.getAssetAndOwner(
      createCommentInput.assetId,
    );
    if (!asset) throw new AssetNotFoundException(createCommentInput.assetId);
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
    return await this.commentRepository.getPaginatedCommentsForAsset(
      assetId,
      pagination,
    );
  }

  async getCommentById(commentId: string) {
    return await this.commentRepository.findOne(commentId, {
      relations: ['author', 'asset'],
    });
  }

  async updateComment(
    updateCommentInput: UpdateCommentInput,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const { id } = updateCommentInput;
    const comment = await this.commentRepository.findOne(id);
    if (!comment) throw new CommentNotFoundException(id);

    this.verifyUserIsAuthor(comment, user.id);

    return await this.commentRepository.updateComment(updateCommentInput);
  }

  async deleteComment(id: string, user: UserEntity) {
    const comment = await this.commentRepository.findOne(id);
    if (!comment) throw new CommentNotFoundException(id);
    this.verifyUserIsAuthor(comment, user.id);
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
