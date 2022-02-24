import { PaginationInfo } from './../../common/pagination-filtering/pagination-info.output';
import * as DataLoader from 'dataloader';
import { CommentEntity } from './../entities/comment.entity';
import { CommentsService } from './../services/comments.service';
import { Injectable, Scope } from '@nestjs/common';
import { PaginationArgs } from '../../common/pagination-filtering/pagination.args';
import { OrderBy } from '../../common/pagination-filtering/order-by.input';
import Direction from '../../common/pagination-filtering/enums/direction.enums';

@Injectable({ scope: Scope.REQUEST })
export class CommentsLoader {
  constructor(private readonly commentsService: CommentsService) {}

  public getPaginatedCommentsByAssetIds(
    paginationArgs: PaginationArgs,
  ): DataLoader<string, CommentEntity[]> {
    return new DataLoader(async (assetIds: string[]) => {
      const comments: CommentEntity[] =
        await this.commentsService.getCommentsByAssetIds(assetIds);
      const commentsByAssetId = this.groupCommentsByAssetId(comments);
      const paginatedComments = this.paginateComments(
        commentsByAssetId,
        paginationArgs,
      );
      return assetIds.map((assetId) => paginatedComments[assetId] ?? []);
    });
  }
  private paginateComments(
    groupedComments: {
      [key: string]: CommentEntity[];
    },
    paginationArgs: PaginationArgs,
  ): { [key: string]: CommentEntity[] } {
    const { limit, offset, orderBy } = paginationArgs;
    const { direction } = orderBy;
    const paginatedComments = {};

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
      paginatedComments[assetId] = {
        paginationInfo,
        paginatedComments,
      };
    });

    return paginatedComments;
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
