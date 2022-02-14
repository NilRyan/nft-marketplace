import { NotFoundException } from '@nestjs/common';

export class NftNotFoundException extends NotFoundException {
  constructor(nftId: string) {
    super(`Nft with id: ${nftId} not found`);
  }
}
