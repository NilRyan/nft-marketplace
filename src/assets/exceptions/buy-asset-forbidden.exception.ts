import { ForbiddenException } from '@nestjs/common';

export class BuyOwnAssetForbiddenException extends ForbiddenException {
  constructor(assetId: string) {
    super(`You cannot buy your own asset: ${assetId}`);
  }
}
