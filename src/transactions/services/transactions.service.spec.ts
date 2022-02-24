import { BuyOwnAssetForbiddenException } from './../../assets/exceptions/buy-asset-forbidden.exception';
import { NotEnoughBalanceException } from './../../users/exceptions/not-enough-balance.exception';
import { AssetEntity } from 'src/assets/entities/asset.entity';
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AssetsService } from '../../assets/services/assets.service';
import { UserEntity } from '../../users/entities/user.entity';
import { WalletEntity } from '../../users/entities/wallet.entity';
import Coin from '../../users/enums/coin.enum';
import { WalletsService } from '../../users/services/wallets.service';
import { TransactionRepository } from './../repositories/transaction.repository';
import { TransactionsService } from './transactions.service';
import { AssetNotFoundException } from '../../assets/exceptions/asset-not-found.exception';

const mockTransactionRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});
const mockWalletsService = () => ({
  increaseBalance: jest.fn(),
  decreaseBalance: jest.fn(),
});
const mockAssetsService = () => ({
  getAssetAndOwner: jest.fn(),
  transferOwnership: jest.fn(),
  increaseAssetValue: jest.fn(),
});

const queryRunner = () => ({
  manager: {
    save: jest.fn(),
  },
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
});
const mockConnection = () => ({
  createQueryRunner: jest.fn().mockReturnValue(queryRunner()),
});
const mockUserEntity: UserEntity = {
  id: 'userId',
  wallet: {
    id: 'walletId',
    coin: Coin.CalapeCoin,
    balance: 500,
  } as WalletEntity,
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email@gmail.com',
} as UserEntity;

describe('Transactions Service', () => {
  let transactionsService: TransactionsService;
  let transactionRepository;
  let walletsService;
  let assetsService;
  let connection;
  let qr;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionRepository,
          useFactory: mockTransactionRepository,
        },
        {
          provide: WalletsService,
          useFactory: mockWalletsService,
        },
        {
          provide: AssetsService,
          useFactory: mockAssetsService,
        },
        {
          provide: Connection,
          useFactory: mockConnection,
        },
      ],
    }).compile();
    transactionsService = module.get(TransactionsService);
    transactionRepository = module.get(TransactionRepository);
    walletsService = module.get(WalletsService);
    assetsService = module.get(AssetsService);
    connection = module.get(Connection);
    qr = connection.createQueryRunner();
  });
  describe('buyAsset', () => {
    it('should return the transaction', async () => {
      const asset: AssetEntity = {
        id: 'assetId',
        owner: mockUserEntity,
        ownerId: mockUserEntity.id,
        price: 100,
        lastSale: null,
        imageUrl: 'imageUrl',
        category: 'category',
        description: 'description',
        creator: mockUserEntity,
      } as AssetEntity;

      const buyer = {
        id: 'buyerId',
        wallet: {
          id: 'buyer-walletId',
          coin: Coin.CalapeCoin,
          balance: 500,
        } as WalletEntity,
        firstName: 'buyerFirstName',
        lastName: 'buyerLastName',
        email: 'buyerEmail@gmail.com',
      } as UserEntity;
      assetsService.getAssetAndOwner.mockResolvedValue(asset);
      qr.manager.save.mockResolvedValue('transactionId');

      transactionRepository.findOne.mockResolvedValue({
        id: 'transactionId',
      });
      const actualTransactionEntity = await transactionsService.buyAsset(
        'assetId',
        buyer,
      );
      expect(actualTransactionEntity).toEqual({ id: 'transactionId' });
      expect(qr.manager.save).toHaveBeenCalled();
      expect(qr.commitTransaction).toHaveBeenCalled();
      expect(qr.release).toHaveBeenCalled();
    });
    it('should throw an AssetNotFoundException  if the asset is not found', async () => {
      assetsService.getAssetAndOwner.mockResolvedValue(null);
      expect(
        transactionsService.buyAsset('assetId', mockUserEntity),
      ).rejects.toThrowError(AssetNotFoundException);
    });

    it('should throw an error if the buyer does not have enough balance', async () => {
      const asset: AssetEntity = {
        id: 'assetId',
        owner: mockUserEntity,
        ownerId: mockUserEntity.id,
        price: 100,
        lastSale: null,
        imageUrl: 'imageUrl',
        category: 'category',
        description: 'description',
        creator: mockUserEntity,
      } as AssetEntity;

      const buyer = {
        id: 'buyerId',
        wallet: {
          id: 'buyer-walletId',
          coin: Coin.CalapeCoin,
          balance: 99,
        } as WalletEntity,
        firstName: 'buyerFirstName',
        lastName: 'buyerLastName',
        email: 'buyerEmail@gmail.com',
      } as UserEntity;
      assetsService.getAssetAndOwner.mockResolvedValue(asset);
      expect(transactionsService.buyAsset('assetId', buyer)).rejects.toThrow(
        NotEnoughBalanceException,
      );
    });
    it('should throw an error if the asset is already owned by the buyer', async () => {
      const buyer = {
        id: 'buyerId',
        wallet: {
          id: 'buyer-walletId',
          coin: Coin.CalapeCoin,
          balance: 120,
        } as WalletEntity,
        firstName: 'buyerFirstName',
        lastName: 'buyerLastName',
        email: 'buyerEmail@gmail.com',
      } as UserEntity;
      const asset: AssetEntity = {
        id: 'assetId',
        owner: buyer,
        ownerId: buyer.id,
        price: 100,
        lastSale: null,
        imageUrl: 'imageUrl',
        category: 'category',
        description: 'description',
        creator: mockUserEntity,
      } as AssetEntity;

      assetsService.getAssetAndOwner.mockResolvedValue(asset);
      expect(transactionsService.buyAsset('assetId', buyer)).rejects.toThrow(
        BuyOwnAssetForbiddenException,
      );
    });
    it('should rollback transaction if an error occurs', async () => {
      const asset: AssetEntity = {
        id: 'assetId',
        owner: mockUserEntity,
        ownerId: mockUserEntity.id,
        price: 100,
        lastSale: null,
        imageUrl: 'imageUrl',
        category: 'category',
        description: 'description',
        creator: mockUserEntity,
      } as AssetEntity;

      const buyer = {
        id: 'buyerId',
        wallet: {
          id: 'buyer-walletId',
          coin: Coin.CalapeCoin,
          balance: 500,
        } as WalletEntity,
        firstName: 'buyerFirstName',
        lastName: 'buyerLastName',
        email: 'buyerEmail@gmail.com',
      } as UserEntity;
      assetsService.getAssetAndOwner.mockResolvedValue(asset);
      qr.manager.save.mockResolvedValue('transactionId');
      walletsService.increaseBalance.mockImplementation(() => {
        throw new Error();
      });
      transactionRepository.findOne.mockResolvedValue({
        id: 'transactionId',
      });

      // expect(actualTransactionEntity).toEqual({ id: 'transactionId' });
      // expect(qr.manager.save).toHaveBeenCalled();
      await expect(
        transactionsService.buyAsset('assetId', buyer),
      ).rejects.toThrowError();
      expect(qr.rollbackTransaction).toHaveBeenCalled();
      expect(qr.release).toHaveBeenCalled();
    });
  });

  describe('viewTransactions', () => {
    it('should return the transactions', async () => {
      const user = new UserEntity();
      const transactions = [
        {
          id: 1,
          asset: {
            id: 1,
            name: 'Bitcoin',
            price: '1',
            owner: user,
          },
          buyer: user,
          seller: user,
        },
      ];
      transactionRepository.find.mockResolvedValue(transactions);
      expect(await transactionsService.viewTransactions(user)).toEqual(
        transactions,
      );
    });
  });
});
