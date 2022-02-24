
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetCurrentUser } from '../../auth/decorators/get-current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';
import { UserEntity } from '../../users/entities/user.entity';

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
    @GetCurrentUser() user: UserEntity,
  ) {
    return this.commentsService.createComment(createCommentInput, user);
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @GetCurrentUser() user: UserEntity,
  ) {
    return await this.commentsService.updateComment(updateCommentInput, user);
  }

  @Mutation(() => Comment)
  async deleteComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @GetCurrentUser() user: UserEntity,
  ) {
    return await this.commentsService.deleteComment(commentId, user);
  }
}
