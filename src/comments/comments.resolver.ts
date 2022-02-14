import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
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
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentsService.updateComment(updateCommentInput);
  }

  @Mutation(() => String)
  removeComment(@Args('id', { type: () => String }) id: string) {
    this.commentsService.removeComment(id);
    return `Comment with id: ${id} has been removed`;
  }
}
