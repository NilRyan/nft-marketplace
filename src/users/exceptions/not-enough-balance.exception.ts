import { UnauthorizedException } from '@nestjs/common';

export class NotEnoughBalanceException extends UnauthorizedException {
  constructor() {
    super(`Not enough balance to perform transaction`);
  }
}
