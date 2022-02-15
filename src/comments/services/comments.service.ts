import { Injectable } from '@nestjs/common';
import { NftService } from 'src/nft/nft.service';
import { UsersService } from 'src/users/services/users.service';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { CommentRepository } from '../repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly usersService: UsersService,
    private readonly nftService: NftService,
  ) {}

  async createComment(createCommentInput: CreateCommentInput) {
    const { authorId, nftId } = createCommentInput;
    const author = await this.usersService.getUserById(authorId);
    const nft = await this.nftService.getNftById(nftId);
    const newComment = this.commentRepository.create({
      ...createCommentInput,
      author,
      nft,
    });
    return this.commentRepository.save(newComment);
  }

  async getCommentsForNft(nftId: string) {
    return await this.commentRepository.find({
      where: {
        nft: {
          id: nftId,
        },
      },
    });
  }

  async getCommentById(commentId: string) {
    return await this.commentRepository.findOne(commentId, {
      relations: ['author', 'nft'],
    });
  }

  async updateComment(updateCommentInput: UpdateCommentInput) {
    const { id } = updateCommentInput;
    await this.commentRepository.update(id, updateCommentInput);
    const updatedComment = await this.commentRepository.findOne(id, {
      relations: ['author', 'nft'],
    });

    return updatedComment;
  }

  async removeComment(id: string) {
    return await this.commentRepository.delete(id);
  }
}
