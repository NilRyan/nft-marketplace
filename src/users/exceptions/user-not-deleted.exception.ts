import { ForbiddenException } from '@nestjs/common';

export class UserNotDeletedException extends ForbiddenException {
  constructor(userId: string) {
    super(`User with id: ${userId} not deleted`);
  }
}
