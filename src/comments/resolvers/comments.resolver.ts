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
  getCommentsForAsset(@Args('assetId', { type: () => String }) assetId: string) {
    return this.commentsService.getCommentsForAsset(assetId);
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @GetUser() { id }: UserEntity,
  ) {
    await this.verifyUserIsAuthor(updateCommentInput.id, id);
    return await this.commentsService.updateComment(updateCommentInput);
  }

  @Mutation(() => String)
  async removeComment(
    @Args('id', { type: () => String }) commentId: string,
    @GetUser() { id }: UserEntity,
  ) {
    await this.verifyUserIsAuthor(commentId, id);
    const deleteResponse = await this.commentsService.removeComment(commentId);
    if (!deleteResponse) throw new CommentNotFoundException(commentId);
    return `Comment with id: ${commentId} has been removed`;
  }

  private async verifyUserIsAuthor(commentId: string, userId: string) {
    const comment = await this.commentsService.getCommentById(commentId);
    if (!comment) throw new CommentNotFoundException(commentId);
    if (comment.authorId !== userId) {
      throw new UnauthorizedException(
        `You can't update comment with id: ${commentId}`,
      );
    }
  }
}
