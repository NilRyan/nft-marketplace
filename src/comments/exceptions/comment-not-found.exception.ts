import { NotFoundException } from '@nestjs/common';

export class CommentNotFoundException extends NotFoundException {
  constructor(commentId: string) {
    super(`Comment with id: ${commentId} not found`);
  }
}
