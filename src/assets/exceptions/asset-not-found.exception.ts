import { NotFoundException } from '@nestjs/common';

export class AssetNotFoundException extends NotFoundException {
  constructor(assetId: string) {
    super(`Asset with id: ${assetId} not found`);
  }
}
