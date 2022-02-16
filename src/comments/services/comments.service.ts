import { CommentEntity } from 'src/comments/entities/comment.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AssetsService } from 'src/assets/assets.service';
import { UsersService } from 'src/users/services/users.service';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { CommentNotFoundException } from '../exceptions/comment-not-found.exception';
import { CommentRepository } from '../repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly usersService: UsersService,
    private readonly assetsService: AssetsService,
  ) {}

  async createComment(createCommentInput: CreateCommentInput) {
    const { authorId, assetId } = createCommentInput;
    const author = await this.usersService.getUserById(authorId);
    const asset = await this.assetsService.getAssetById(assetId);
    const newComment = this.commentRepository.create({
      ...createCommentInput,
      author,
      asset,
    });
    return this.commentRepository.save(newComment);
  }

  async getCommentsForAsset(assetId: string) {
    return await this.commentRepository.find({
      where: {
        asset: {
          id: assetId,
        },
      },
    });
  }

  async getCommentById(commentId: string) {
    return await this.commentRepository.findOne(commentId, {
      relations: ['author', 'asset'],
    });
  }

  async updateComment(
    updateCommentInput: UpdateCommentInput,
    user: UserEntity,
  ) {
    const { id } = updateCommentInput;
    const comment = await this.commentRepository.findOne(id);
    if (!comment) throw new CommentNotFoundException(id);

    await this.verifyUserIsAuthor(comment, user.id);

    await this.commentRepository.update(id, updateCommentInput);
    const updatedComment = await this.commentRepository.findOne(id, {
      relations: ['author', 'asset'],
    });

    return updatedComment;
  }

  async deleteComment(id: string, user: UserEntity) {
    const comment = await this.commentRepository.findOne(id);

    this.verifyUserIsAuthor(comment, user.id);
    if (!comment) throw new CommentNotFoundException(id);
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
