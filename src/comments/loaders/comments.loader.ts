import { PaginationInfo } from './../../common/pagination-filtering/pagination-info.output';
import * as DataLoader from 'dataloader';
import { CommentsService } from './../services/comments.service';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CommentsLoader {
  constructor(private readonly commentsService: CommentsService) {}
  paginationArgs: PaginationInfo;

  public getPaginatedCommentsByAssetIdsLoader = new DataLoader(
    async (assetIds: string[]) => {
      const paginatedComments =
        await this.commentsService.getCommentsByAssetIds(
          assetIds,
          this.paginationArgs,
        );

      return assetIds.map((assetId) => paginatedComments[assetId] ?? []);
    },
  );

  public getPaginatedCommentsForAsset(paginationArgs) {
    this.paginationArgs = paginationArgs;
    return this.getPaginatedCommentsByAssetIdsLoader;
  }
}
