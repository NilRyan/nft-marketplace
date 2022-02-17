import { Asset } from 'src/assets/models/asset.model';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/auth/get-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { PaginationParams } from 'src/common/pagination-params.input';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { Comment } from '../models/comment.model';
import { CommentsService } from '../services/comments.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @GetUser() user: UserEntity,
  ) {
    return this.commentsService.createComment(createCommentInput, user);
  }

  @Query(() => Asset)
  async getAssetAndComments(
    @Args('assetId', { type: () => String }) assetId: string,
    @Args('pagination', { type: () => PaginationParams })
    pagination: PaginationParams,
  ) {
    return await this.commentsService.getCommentsForAsset(assetId, pagination);
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @GetUser() user: UserEntity,
  ) {
    return await this.commentsService.updateComment(updateCommentInput, user);
  }

  @Mutation(() => Comment)
  async deleteComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @GetUser() user: UserEntity,
  ) {
    return await this.commentsService.deleteComment(commentId, user);
  }
}
