import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as currency from 'currency.js';
import Role from '../auth/enums/role.enum';
import { AssetSearchArgs } from '../common/pagination-filtering/asset-search.args';
import { UserEntity } from '../users/entities/user.entity';
import { AssetsRepository } from './assets.repository';
import { CreateAssetInput } from './dto/create-asset.input';
import { AssetEntity } from './entities/asset.entity';
import { AssetNotFoundException } from './exceptions/asset-not-found.exception';

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  constructor(private readonly assetRepository: AssetsRepository) {}
  async createAsset(createAssetInput: CreateAssetInput, user: UserEntity) {
    return await this.assetRepository.createAsset(createAssetInput, user);
  }

  async transferOwnership(
    asset: AssetEntity,
    newOwner: UserEntity,
  ): Promise<AssetEntity> {
    asset.owner = newOwner;
    asset.ownerId = newOwner.id;
    asset.lastSale = new Date();
    return asset;
  }

  async getAssets(assetSearchArgs: AssetSearchArgs) {
    return await this.assetRepository.getAssets(assetSearchArgs);
  }

  async getAssetAndOwner(assetId: string): Promise<AssetEntity> {
    const asset = await this.assetRepository.getAssetAndOwner(assetId);
    if (!asset) throw new AssetNotFoundException(assetId);
    return asset;
  }

  async increaseAssetValue(asset: AssetEntity) {
    const { price } = asset;
    // NOTE: Price growth is 10%
    const newPrice = currency(price, { precision: 8 }).multiply(1.1).value;
    asset.price = newPrice;
    return asset;
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
