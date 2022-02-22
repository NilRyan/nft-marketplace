import { WalletEntity } from './../entities/wallet.entity';
import { Test } from '@nestjs/testing';
import { UserEntity } from '../entities/user.entity';
import Coin from '../enums/coin.enum';
import { WalletsRepository } from '../repositories/wallets.repository';
import { WalletsService } from './wallets.service';

const mockWalletsRepository = () => ({
  createWallet: jest.fn(),
  findOne: jest.fn(),
});
const mockUserEntity = {
  id: '265adc7b-94b6-440f-ab45-014a26139e7d',
  username: 'testUser',
  firstName: 'Test',
  lastName: 'User',
  email: 'testemail@gmail.com',
} as UserEntity;

const mockWallet = {
  id: 'wallet1',
  owner: mockUserEntity,
  balance: 20,
  coin: Coin.CalapeCoin,
  ownerId: mockUserEntity.id,
} as WalletEntity;
describe('Wallets Service', () => {
  let walletsService: WalletsService;

  let walletsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WalletsService,
        {
          provide: WalletsRepository,
          useFactory: mockWalletsRepository,
        },
      ],
    }).compile();

    walletsService = module.get(WalletsService);
    walletsRepository = module.get(WalletsRepository);
  });

  describe('createWallet', () => {
    it('returns the created Wallet', async () => {
      walletsRepository.createWallet.mockResolvedValue({
        id: '25',
        coin: 'BTC',
        balance: '0.00',
      });

      const wallet = await walletsService.createWallet(mockUserEntity);

      expect(wallet).toEqual({
        id: '25',
        coin: 'BTC',
        balance: '0.00',
      });
    });
  });

  describe('getWalletByOwner', () => {
    it('returns the wallet', async () => {
      walletsRepository.findOne.mockResolvedValue({
        id: '25',
        coin: 'BTC',
        balance: '0.00',
      });

      const wallet = await walletsService.getWalletByOwner(mockUserEntity);

      expect(wallet).toEqual({
        id: '25',
        coin: 'BTC',
        balance: '0.00',
      });
    });
  });

  describe('increaseBalance', () => {
    it('returns the wallet increased by the given amount', async () => {
      const wallet = await walletsService.increaseBalance(
        {
          ...mockWallet,
          balance: 20,
        },
        255,
      );
      expect(wallet).toEqual({
        ...mockWallet,
        balance: 275,
      });
    });
  });

  describe('decreaseBalance', () => {
    it('returns the wallet decreased by the given amount', async () => {
      const wallet = await walletsService.decreaseBalance(
        {
          ...mockWallet,
          balance: 300,
        },
        50,
      );
      expect(wallet).toEqual({
        ...mockWallet,
        balance: 250,
      });
    });
  });
});
