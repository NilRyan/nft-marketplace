import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { CommentNotFoundException } from '../exceptions/comment-not-found.exception';
import { Comment } from '../models/comment.model';
import { CommentsService } from '../services/comments.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentsService.createComment(createCommentInput);
  }

  @Query(() => [Comment])
  getCommentsForAsset(
    @Args('assetId', { type: () => String }) assetId: string,
  ) {
    return this.commentsService.getCommentsForAsset(assetId);
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
