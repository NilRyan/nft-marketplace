import { CommentNotFoundException } from './exceptions/comment-not-found.exception';
import { UsersService } from './../users/users.service';
import { CommentRepository } from './comments.repository';
import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { NftService } from 'src/nft/nft.service';

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
