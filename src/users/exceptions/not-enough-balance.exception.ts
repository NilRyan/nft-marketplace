import { ForbiddenException } from '@nestjs/common';

export class NotEnoughBalanceException extends ForbiddenException {
  constructor() {
    super(`Not enough balance to perform transaction`);
  }
}
