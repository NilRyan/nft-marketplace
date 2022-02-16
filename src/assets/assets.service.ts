import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { AssetsRepository } from './assets.repository';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';
import { AssetEntity } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  constructor(private readonly assetRepository: AssetsRepository) {}
  async createAsset(createAssetInput: CreateAssetInput, user: UserEntity) {
    const newAsset = await this.assetRepository.create({
      ...createAssetInput,
      owner: user,
    });

    return await this.assetRepository.save(newAsset);
  }

  async transferOwnership(id: string, newOwner: UserEntity) {
    return await this.assetRepository.update(id, { owner: newOwner });
  }

  async getAssets(): Promise<AssetEntity[]> {
    return await this.assetRepository.find({
      relations: ['owner', 'comments'],
    });
  }

  async getAssetById(id: string) {
    const asset = await this.assetRepository.findOne(id, {
      relations: ['owner', 'comments'],
    });
    return asset;
  }
  async getAssetAndOwner(assetId: string): Promise<AssetEntity> {
    return await this.assetRepository.getAssetAndOwner(assetId);
  }

  async updateAsset(updateAssetInput: UpdateAssetInput) {
    const { id } = updateAssetInput;
    await this.assetRepository.update(id, updateAssetInput);
    const updatedPost = await this.assetRepository.findOne(id, {
      relations: ['owner', 'comments'],
    });

    return updatedPost;
  }
  async increaseAssetValue(asset: AssetEntity) {
    const { price, id } = asset;
    const newPrice = price + 1;
    await this.assetRepository.update(id, { price: newPrice });
  }

  async removeAsset(id: string) {
    return await this.assetRepository.softDelete(id);
  }

  async restoreDeletedAsset(id: string) {
    return await this.assetRepository.restore(id);
  }
}
