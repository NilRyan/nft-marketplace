import { CreateAssetInput } from './dto/create-asset.input';
import { EntityRepository, ILike, Repository } from 'typeorm';
import { AssetEntity } from './entities/asset.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AssetSearchArgs } from '../common/pagination-filtering/asset-search.args';

@EntityRepository(AssetEntity)
export class AssetsRepository extends Repository<AssetEntity> {
  async getAssetAndOwner(assetId: string): Promise<AssetEntity> {
    return await this.findOne(assetId, {
      relations: ['owner', 'owner.wallet'],
    });
  }
  async createAsset(createAssetInput: CreateAssetInput, user: UserEntity) {
    const newAsset = this.create({
      ...createAssetInput,
      owner: user,
      creator: user,
      creatorId: user.id,
    });

    return await this.save(newAsset);
  }
  async getAssets(assetSearchArgs: AssetSearchArgs) {
    const { searchTerm, limit, offset, orderBy } = assetSearchArgs;
    const { field, sortOrder } = orderBy;
    const [assets, count] = await this.findAndCount({
      where: [
        { title: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
        { category: ILike(`%${searchTerm}%`) },
        { creator: { username: ILike(`%${searchTerm}%`) } },
        { creator: { firstName: ILike(`%${searchTerm}%`) } },
        { creator: { lastName: ILike(`%${searchTerm}%`) } },
        { owner: { username: ILike(`%${searchTerm}%`) } },
        { owner: { firstName: ILike(`%${searchTerm}%`) } },
        { owner: { lastName: ILike(`%${searchTerm}%`) } },
      ],
      order: {
        [field]: sortOrder,
      },
      skip: offset,
      take: limit,
      relations: ['owner', 'creator'],
    });
    return {
      assets,
      paginationInfo: {
        total: count,
        limit,
        offset,
      },
    };
  }
}
