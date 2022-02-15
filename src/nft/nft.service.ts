import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateNftInput } from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { NftEntity } from './entities/nft.entity';
import { NftRepository } from './nft.repository';

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);

  constructor(private readonly nftRepository: NftRepository) {}
  async createNft(createNftInput: CreateNftInput, user: UserEntity) {
    const newNft = await this.nftRepository.create({
      ...createNftInput,
      owner: user,
    });

    return await this.nftRepository.save(newNft);
  }

  async getNfts(): Promise<NftEntity[]> {
    return await this.nftRepository.find({
      relations: ['owner', 'comments'],
    });
  }

  async getNftById(id: string) {
    const nft = await this.nftRepository.findOne(id, {
      relations: ['owner', 'comments'],
    });
    return nft;
  }

  async updateNft(updateNftInput: UpdateNftInput) {
    const { id } = updateNftInput;
    await this.nftRepository.update(id, updateNftInput);
    const updatedPost = await this.nftRepository.findOne(id, {
      relations: ['owner', 'comments'],
    });

    return updatedPost;
  }

  async removeNft(id: string) {
    return await this.nftRepository.softDelete(id);
  }

  async restoreDeletedNft(id: string) {
    return await this.nftRepository.restore(id);
  }
}
