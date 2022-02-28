import { ForbiddenException } from '@nestjs/common';

export class AssetNotDeletedException extends ForbiddenException {
  constructor(assetId: string) {
    super(`Asset with id: ${assetId} not deleted`);
  }
}
