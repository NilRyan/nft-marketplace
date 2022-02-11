import { Injectable } from '@nestjs/common';
import { CreateNftInput } from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { NftRepository } from './nft.repository';

@Injectable()
export class NftService {
  constructor(private readonly nftRepository: NftRepository) {}
  create(createNftInput: CreateNftInput) {
    return 'This action adds a new nft';
  }

  findAll() {
    return `This action returns all nft`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nft`;
  }

  update(id: number, updateNftInput: UpdateNftInput) {
    return `This action updates a #${id} nft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nft`;
  }
}
