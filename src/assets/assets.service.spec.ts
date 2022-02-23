import { AssetEntity } from './entities/asset.entity';
import { CreateAssetInput } from './dto/create-asset.input';
import { Test } from '@nestjs/testing';
import { AssetsRepository } from './assets.repository';
import { AssetsService } from './assets.service';
import { UserEntity } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/pagination-filtering/pagination.args';
import { AssetSearchArgs } from '../common/pagination-filtering/asset-search.args';

const mockAssetsRepository = () => ({
  createAsset: jest.fn(),
  getAssets: jest.fn(),
  findOne: jest.fn(),
  getAssetAndOwner: jest.fn(),
});

describe('Assets Service', () => {
  let service: AssetsService;
  let assetsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AssetsService,
        {
          provide: AssetsRepository,
          useFactory: mockAssetsRepository,
        },
      ],
    }).compile();
    service = module.get(AssetsService);
    assetsRepository = module.get(AssetsRepository);
  });

  describe('createAsset', () => {
    it('returns the created asset', async () => {
      const createAssetInput: CreateAssetInput = {
        title: 'test',
        description: 'test',
        category: 'test',
        imageUrl: 'imageurl.com/image.png',
        price: 600,
      };
      const user = {
        id: 'mock-user-id',
        username: 'test',
        firstName: 'test',
        lastName: 'test',
      } as UserEntity;
      assetsRepository.createAsset.mockResolvedValue({
        ...createAssetInput,
      } as AssetEntity);
      const actualAsset = await service.createAsset(createAssetInput, user);
      expect(assetsRepository.createAsset).toHaveBeenCalledWith(
        createAssetInput,
        user,
      );
      expect(actualAsset).toEqual({ ...createAssetInput });
    });
  });

  describe('transferOwnership', () => {
    it('returns the asset with the buyer as owner', async () => {
      const asset = {
        id: 'mock-asset-id',
        title: 'test',
        description: 'test',
        category: 'test',
        imageUrl: 'imageurl.com/image.png',
        price: 600,
        owner: {
          id: 'seller-user-id',
          username: 'seller',
          firstName: 'test seller',
          lastName: 'test seller',
        } as UserEntity,
      } as AssetEntity;
      const buyer = {
        id: 'mock-buyer-id',
        username: 'buyer',
        firstName: 'test buyer',
        lastName: 'test buyer',
      } as UserEntity;
      const actualAsset = await service.transferOwnership(asset, buyer);
      expect(actualAsset).toEqual({
        ...asset,
        owner: buyer,
      });
    });
  });
  describe('getAssets', () => {
    it('returns the result', async () => {
      const assetSearchArgs: AssetSearchArgs = {
        limit: 10,
        offset: 0,
        orderBy: {
          field: 'title',
          sortOrder: 'ASC',
        },
        searchTerm: 'test',
      };
      assetsRepository.getAssets.mockResolvedValue([]);
      const actualAssets = await service.getAssets(assetSearchArgs);
      expect(assetsRepository.getAssets).toHaveBeenCalledWith(assetSearchArgs);
      expect(actualAssets).toEqual([]);
    });
  });
});
