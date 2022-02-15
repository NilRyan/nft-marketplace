import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { CommentNotFoundException } from './exceptions/comment-not-found.exception';
import { Comment } from './models/comment.model';

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
  getCommentsForNft(@Args('nftId', { type: () => String }) nftId: string) {
    return this.commentsService.getCommentsForNft(nftId);
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    const updatedComment = await this.commentsService.updateComment(
      updateCommentInput,
    );
    if (!updatedComment) {
      throw new CommentNotFoundException(updateCommentInput.id);
    }

    return updatedComment;
  }

  @Mutation(() => String)
  async removeComment(@Args('id', { type: () => String }) id: string) {
    const deleteResponse = await this.commentsService.removeComment(id);
    if (!deleteResponse) throw new CommentNotFoundException(id);
    return `Comment with id: ${id} has been removed`;
  }
}
