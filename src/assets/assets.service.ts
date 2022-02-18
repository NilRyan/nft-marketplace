import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as currency from 'currency.js';
import Role from 'src/auth/enums/role.enum';
import { AssetSearchArgs } from 'src/common/pagination-filtering/asset-search.args';
import { UserEntity } from 'src/users/entities/user.entity';
import { ILike } from 'typeorm';
import { AssetsRepository } from './assets.repository';
import { CreateAssetInput } from './dto/create-asset.input';
import { AssetEntity } from './entities/asset.entity';
import { AssetNotFoundException } from './exceptions/asset-not-found.exception';

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  constructor(private readonly assetRepository: AssetsRepository) {}
  async createAsset(createAssetInput: CreateAssetInput, user: UserEntity) {
    const newAsset = this.assetRepository.create({
      ...createAssetInput,
      owner: user,
      creator: user,
      creatorId: user.id,
    });

    return await this.assetRepository.save(newAsset);
  }

  async transferOwnership(id: string, newOwner: UserEntity) {
    return await this.assetRepository.update(id, {
      owner: newOwner,
      lastSale: new Date(),
    });
  }

  async getAssets(assetSearchArgs: AssetSearchArgs) {
    const { searchTerm, limit, offset, orderBy } = assetSearchArgs;
    const { field, sortOrder } = orderBy;
    const [assets, count] = await this.assetRepository.findAndCount({
      where: [
        {
          title: ILike(`%${searchTerm}%`),
        },
        {
          description: ILike(`%${searchTerm}%`),
        },
        { category: ILike(`%${searchTerm}%`) },
        {
          creator: {
            username: ILike(`%${searchTerm}%`),
            firstName: ILike(`%${searchTerm}%`),
            lastName: ILike(`%${searchTerm}%`),
          },
        },
        {
          owner: {
            username: ILike(`%${searchTerm}%`),
            firstName: ILike(`%${searchTerm}%`),
            lastName: ILike(`%${searchTerm}%`),
          },
        },
      ],
      order: {
        [field]: sortOrder,
      },
      skip: offset,
      take: limit,
      relations: ['owner', 'creator'],
    });
    // if (count === 0)
    //   return {
    //     assets: [],
    //     paginationInfo: {
    //       total: count,
    //     },
    //   };
    return {
      assets,
      paginationInfo: {
        total: count,
        limit,
        offset,
      },
    };
  }

  async getAssetById(assetId: string) {
    const asset = await this.assetRepository.findOne(assetId, {
      relations: ['owner'],
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
