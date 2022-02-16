import { EntityRepository, Repository } from 'typeorm';
import { AssetEntity } from './entities/asset.entity';

@EntityRepository(AssetEntity)
export class AssetsRepository extends Repository<AssetEntity> {
  async getAssetAndOwner(assetId: string): Promise<AssetEntity> {
    return await this.findOne(assetId, {
      relations: ['owner'],
    });
  }
}
