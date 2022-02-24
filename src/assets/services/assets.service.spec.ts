import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import Role from '../../auth/enums/role.enum';
import { AssetSearchArgs } from '../../common/pagination-filtering/asset-search.args';
import { UserEntity } from '../../users/entities/user.entity';
import { AssetsRepository } from '../repositories/assets.repository';
import { AssetsService } from './assets.service';
import { CreateAssetInput } from '../dto/create-asset.input';
import { AssetEntity } from '../entities/asset.entity';
import { AssetNotFoundException } from '../exceptions/asset-not-found.exception';

const mockAssetsRepository = () => ({
  createAsset: jest.fn(),
  getAssets: jest.fn(),
  findOne: jest.fn(),
  getAssetAndOwner: jest.fn(),
  softDelete: jest.fn(),
  find: jest.fn(),
  restore: jest.fn(),
});

describe('Assets Service', () => {
  let assetsService: AssetsService;
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
    assetsService = module.get(AssetsService);
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
      const actualAsset = await assetsService.createAsset(
        createAssetInput,
        user,
      );
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
        ownerId: 'seller-user-id',
      } as AssetEntity;
      const buyer = {
        id: 'mock-buyer-id',
        username: 'buyer',
        firstName: 'test buyer',
        lastName: 'test buyer',
      } as UserEntity;
      const actualAsset = await assetsService.transferOwnership(asset, buyer);
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
      const actualAssets = await assetsService.getAssets(assetSearchArgs);
      expect(assetsRepository.getAssets).toHaveBeenCalledWith(assetSearchArgs);
      expect(actualAssets).toEqual([]);
    });
  });

  describe('getAssetAndOwner', () => {
    it('returns the asset', async () => {
      const asset = {
        id: 'mock-asset-id',
        title: 'test',
        description: 'test',
        category: 'test',
        imageUrl: 'imageurl.com/image.png',
        price: 600,
        ownerId: 'mock-owner-id',
        owner: {
          id: 'mock-owner-id',
          username: 'test',
          firstName: 'test',
          lastName: 'test',
        } as UserEntity,
      } as AssetEntity;
      assetsRepository.getAssetAndOwner.mockResolvedValue(asset);
      const actualAsset = await assetsService.getAssetAndOwner('mock-asset-id');
      expect(actualAsset).toEqual(asset);
    });
    it('throws an AssetNotFoundException if asset does not exist', async () => {
      assetsRepository.getAssetAndOwner.mockResolvedValue(null);
      await expect(
        assetsService.getAssetAndOwner('mock-asset-id'),
      ).rejects.toThrow(AssetNotFoundException);
    });
  });
  describe('increaseAssetValue', () => {
    it('returns the asset with increased value', async () => {
      const asset: AssetEntity = {
        id: 'mock-asset-id',
        title: 'test',
        description: 'test',
        price: 600,
        category: 'test',
        imageUrl: 'imageurl.com/image.png',
      } as AssetEntity;
      expect(await assetsService.increaseAssetValue(asset)).toEqual({
        ...asset,
        price: 660,
      });
    });
  });
  describe('remove asset', () => {
    it('deletes and returns the asset if user owns the asset', async () => {
      const user = {
        id: 'mock-user-id',
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        role: Role.User,
      } as UserEntity;

      const asset: AssetEntity = {
        id: 'mock-asset-id',
        title: 'test',
        description: 'test',
        price: 600,
        category: 'test',
        imageUrl: 'imageurl.com/image.png',
        owner: user,
        ownerId: user.id,
      } as AssetEntity;
      assetsRepository.findOne.mockResolvedValue(asset);
      const actualAsset = await assetsService.removeAsset(asset.id, user);
      expect(assetsRepository.softDelete).toHaveBeenCalledWith(asset.id);
      expect(actualAsset).toEqual(asset);
    });

    it('deletes and returns the asset if user role is Role.Admin', async () => {
      const user = {
        id: 'mock-user-id',
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        role: Role.Admin,
      } as UserEntity;

      const asset: AssetEntity = {
        id: 'mock-asset-id',
        title: 'test',
        description: 'test',
        price: 600,
        category: 'test',
        imageUrl: 'imageurl.com/image.png',
        owner: user,
        ownerId: user.id,
      } as AssetEntity;
      assetsRepository.findOne.mockResolvedValue(asset);
      const actualAsset = await assetsService.removeAsset(asset.id, user);
      expect(assetsRepository.softDelete).toHaveBeenCalledWith(asset.id);
      expect(actualAsset).toEqual(asset);
    });

    it('throws an AssetNotFoundException if asset does not exist', async () => {
      assetsRepository.findOne.mockResolvedValue(null);
      expect(
        assetsService.removeAsset('mock-asset-id', {} as UserEntity),
      ).rejects.toThrow(AssetNotFoundException);
    });
    it('throws an UnauthorizedException if user does not own asset and is not an admin', async () => {
      const user = {
        id: 'mock-user-id',
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        role: Role.User,
      } as UserEntity;

      const asset: AssetEntity = {
        id: 'mock-asset-id',
        title: 'test',
        description: 'test',
        price: 600,
        category: 'test',
        imageUrl: 'imageurl.com/image.png',
        ownerId: 'another-user-id',
      } as AssetEntity;
      assetsRepository.findOne.mockResolvedValue(asset);
      expect(assetsService.removeAsset(asset.id, user)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(assetsRepository.softDelete).not.toHaveBeenCalled();
    });
  });
  describe('restoreDeletedAsset', () => {
    it('restores and returns the asset', async () => {
      const user = {
        id: 'mock-user-id',
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        role: Role.Admin,
      } as UserEntity;
      const asset: AssetEntity = {
        id: 'mock-asset-id',
        title: 'test',
        description: 'test',
        price: 600,
        category: 'test',
        imageUrl: 'imageurl.com/image.png',
        owner: user,
        ownerId: user.id,
      } as AssetEntity;
      assetsRepository.find.mockResolvedValue(asset);
      const actualAsset = await assetsService.restoreDeletedAsset(asset.id);
      expect(assetsRepository.restore).toHaveBeenCalledWith(asset.id);
      expect(actualAsset).toEqual(asset);
    });
    it('throws an AssetNotFoundException if asset does not exist', async () => {
      assetsRepository.find.mockResolvedValue(null);
      expect(
        assetsService.restoreDeletedAsset('mock-asset-id'),
      ).rejects.toThrow(AssetNotFoundException);
    });
  });
});
