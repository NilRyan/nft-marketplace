import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as currency from 'currency.js';
import Role from 'src/auth/enums/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { AssetsRepository } from './assets.repository';
import { CreateAssetInput } from './dto/create-asset.input';
import { AssetEntity } from './entities/asset.entity';
import { AssetNotFoundException } from './exceptions/asset-not-found.exception';

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
    return await this.assetRepository.update(id, {
      owner: newOwner,
      lastSale: new Date(),
    });
  }

  async getAssets(): Promise<AssetEntity[]> {
    return await this.assetRepository.find({
      relations: ['owner', 'comments'],
    });
  }

  async getAssetById(assetId: string) {
    const asset = await this.assetRepository.findOne(assetId, {
      relations: ['owner', 'comments'],
    });
    if (!asset) throw new AssetNotFoundException(assetId);
    return asset;
  }
  async getAssetAndOwner(assetId: string): Promise<AssetEntity> {
    const asset = await this.assetRepository.getAssetAndOwner(assetId);
    if (!asset) throw new AssetNotFoundException(assetId);
    return asset;
  }

  async increaseAssetValue(asset: AssetEntity) {
    const { price, id } = asset;
    // NOTE: Price growth is 10%
    const newPrice = currency(price, { precision: 8 }).multiply(1.1).value;
    await this.assetRepository.update(id, { price: newPrice });
  }

  async removeAsset(id: string, user: UserEntity) {
    const asset = await this.assetRepository.findOne({ where: { id } });
    if (!asset) throw new AssetNotFoundException(id);

    if (asset.ownerId === user.id || user.role === Role.Admin) {
      await this.assetRepository.softDelete(id);
      return asset;
    } else {
      throw new UnauthorizedException(
        'You are not authorized to delete this asset',
      );
    }
  }

  async restoreDeletedAsset(id: string) {
    const asset = await this.assetRepository.find({ where: { id } });
    await this.assetRepository.restore(id);
    if (!asset) throw new AssetNotFoundException(id);

    return asset;
  }
}
