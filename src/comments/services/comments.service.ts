import { OrderBy } from '../../common/pagination-filtering/order-by.input';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { CommentNotFoundException } from '../exceptions/comment-not-found.exception';
import { CommentsRepository } from '../repositories/comments.repository';
import { AssetsService } from '../../assets/services/assets.service';
import { PaginationArgs } from '../../common/pagination-filtering/pagination.args';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../entities/comment.entity';
import { AssetNotFoundException } from '../../assets/exceptions/asset-not-found.exception';
import Direction from '../../common/pagination-filtering/enums/direction.enums';
import { PaginationInfo } from '../../common/pagination-filtering/pagination-info.output';

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
  async getCommentsByAssetIds(
    assetIds: string[],
    paginationArgs: PaginationInfo,
  ) {
    const comments = await this.commentRepository.getCommentsByAssetIds(
      assetIds,
    );
    // this.logger.log(comments);

    const commentsByAssetId = this.groupCommentsByAssetId(comments);
    const paginatedComments = this.paginateComments(
      commentsByAssetId,
      paginationArgs,
    );
    return paginatedComments;
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

  private paginateComments(
    groupedComments: {
      [key: string]: CommentEntity[];
    },
    paginationArgs: PaginationArgs,
  ): { [key: string]: CommentEntity[] } {
    const { limit, offset, orderBy } = paginationArgs;
    const { direction } = orderBy;
    const paginatedCommentsOutput = {};

    const dateSorter = (a: CommentEntity, b: CommentEntity) => {
      if (direction === Direction.ASC) {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
      if (direction === Direction.DESC) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    };

    Object.keys(groupedComments).forEach((assetId) => {
      const paginationLimit =
        groupedComments[assetId].length - offset > limit
          ? limit
          : groupedComments[assetId].length - offset;

      const paginatedComments = groupedComments[assetId]
        .sort(dateSorter)
        .slice(offset, paginationLimit);
      const paginationInfo: PaginationInfo = {
        total: groupedComments[assetId].length,
        limit,
        offset,
      };
      paginatedCommentsOutput[assetId] = {
        paginationInfo,
        comments: paginatedComments,
      };
    });
    return paginatedCommentsOutput;
  }

  private groupCommentsByAssetId(comments: CommentEntity[]): {
    [key: string]: CommentEntity[];
  } {
    const commentsByAssetId = {};

    comments.forEach((comment) => {
      if (!commentsByAssetId[comment.assetId]) {
        commentsByAssetId[comment.assetId] = [];
      }
      commentsByAssetId[comment.assetId].push(comment);
    });

    return commentsByAssetId;
  }
}
