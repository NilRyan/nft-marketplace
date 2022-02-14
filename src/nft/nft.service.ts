import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateNftInput } from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { NftEntity } from './entities/nft.entity';
import { NftNotFoundException } from './exceptions/nft-not-found.exception';
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
    if (!nft) throw new NftNotFoundException(id);
    return nft;
  }

  async updateNft(updateNftInput: UpdateNftInput) {
    const { id } = updateNftInput;
    await this.nftRepository.update(id, updateNftInput);
    const updatedPost = await this.nftRepository.findOne(id, {
      relations: ['owner', 'comments'],
    });

    if (!updatedPost) {
      this.logger.warn(`Nft with id: ${id} not found`);
      throw new NftNotFoundException(id);
    }

    return updatedPost;
  }

  async removeNft(id: string) {
    const deleteResponse = await this.nftRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new NftNotFoundException(id);
    }
  }

  async restoreDeletedNft(id: string) {
    const restoreResponse = await this.nftRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new NftNotFoundException(id);
    }
  }
}
