import { AssetsRepository } from './../../assets/repositories/assets.repository';
import { UserNotFoundException } from './../exceptions/user-not-found.exception';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import Role from '../../auth/enums/role.enum';
import PostgresErrorCode from '../../database/enums/postgres-error-code.enum';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { UsersService } from './users.service';
import { WalletsService } from './wallets.service';
import Gender from '../enums/gender.enum';

const mockUsersRepository = () => ({
  createUser: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  softRemove: jest.fn(),
  restore: jest.fn(),
  softDelete: jest.fn(),
});

const mockWalletsService = () => ({
  createWallet: jest.fn(),
});

const mockAssetsRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  softRemove: jest.fn(),
  restore: jest.fn(),
});

const mockUserEntity = {
  id: 'mock-user-id',
  username: 'test',
  firstName: 'test',
  lastName: 'test',
  email: 'test@gmail.com',
  role: Role.Admin,
} as UserEntity;

describe('Users Service', () => {
  let usersService: UsersService;
  let usersRepository;
  let walletsService;
  let assetsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: AssetsRepository,
          useFactory: mockAssetsRepository,
        },
        {
          provide: UsersRepository,
          useFactory: mockUsersRepository,
        },
        {
          provide: WalletsService,
          useFactory: mockWalletsService,
        },
      ],
    }).compile();
    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
    walletsService = module.get(WalletsService);
    assetsRepository = module.get(AssetsRepository);
  });

  describe('createUserWithWallet', () => {
    it('returns the created user with wallet', async () => {
      const registerUserInput = {
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        email: 'test@gmail.com',
        password: 'testPassword123',
        birthDate: new Date(),
        gender: Gender.Male,
      };
      usersRepository.createUser.mockResolvedValue(mockUserEntity);
      walletsService.createWallet.mockResolvedValue({
        id: 'testWalletId',
        balance: 100,
        owner: mockUserEntity,
        ownerId: mockUserEntity.id,
      });

      const actualUser = await usersService.createUserWithWallet(
        registerUserInput,
      );
      expect(usersRepository.save).toHaveBeenCalled();
      expect(actualUser).toEqual({
        ...mockUserEntity,
        wallet: {
          id: 'testWalletId',
          balance: 100,
          owner: mockUserEntity,
          ownerId: mockUserEntity.id,
        },
      });
    });
  });

  describe('getUserById', () => {
    it('returns the user', async () => {
      usersRepository.findOne.mockResolvedValue(mockUserEntity);

      const actualUser = await usersService.getUserById(mockUserEntity.id);
      expect(actualUser).toEqual(mockUserEntity);
    });
  });
  describe('getUserByUsername', () => {
    it('returns the user', async () => {
      usersRepository.findOne.mockResolvedValue(mockUserEntity);
      const actualUser = await usersService.getUserByUsername(
        mockUserEntity.username,
      );
      expect(actualUser).toEqual(mockUserEntity);
    });
  });

  describe('updateUser', () => {
    it('returns the updated user', async () => {
      const updateUserInput = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
      };
      usersRepository.update.mockResolvedValue(mockUserEntity);
      usersRepository.findOne.mockResolvedValue({
        ...mockUserEntity,
        ...updateUserInput,
      });
      const actualUser = await usersService.updateUser(
        updateUserInput,
        mockUserEntity,
      );

      expect(actualUser).toEqual({
        ...mockUserEntity,
        firstName: 'newFirstName',
        lastName: 'newLastName',
      });
    });

    it('throws a ForbiddenException if input violates UNIQUE constraint for username or email', async () => {
      const uniqueViolationError = new Error() as any;
      uniqueViolationError.code = PostgresErrorCode.UniqueViolation;
      usersRepository.update.mockRejectedValue(uniqueViolationError);

      expect(usersService.updateUser({} as any, {} as any)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
  describe('deleteUser', () => {
    it('deletes and returns the User if user role is admin', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 'testUserId',
      });
      const actualUser = await usersService.deleteUser(
        'testUserId',
        mockUserEntity,
      );
      expect(usersRepository.softDelete).toHaveBeenCalledWith('testUserId');
      expect(actualUser).toEqual({
        id: 'testUserId',
      });
    });
    it('deletes and returns the User if User deletes own account', async () => {
      const actualUser = await usersService.deleteUser(
        'mock-user-id',
        mockUserEntity,
      );
      expect(usersRepository.softDelete).toHaveBeenCalledWith('mock-user-id');
      expect(assetsRepository.softRemove).toHaveBeenCalled();
      expect(actualUser).toEqual(mockUserEntity);
    });
    it('throws a UserNotFoundException if user does not exist and user role is admin', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      expect(
        usersService.deleteUser('testUserId', mockUserEntity),
      ).rejects.toThrow(UserNotFoundException);
      expect(usersRepository.softRemove).not.toHaveBeenCalled();
    });
    it('throws a ForbiddenException if user role is not admin or user does not own account', async () => {
      expect(
        usersService.deleteUser('testUserId', {
          ...mockUserEntity,
          role: Role.User,
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(usersRepository.softRemove).not.toHaveBeenCalled();
    });
  });
  describe('restoreUser', () => {
    it('restores the deleted user and returns it', async () => {
      usersRepository.findOne.mockResolvedValue(mockUserEntity);
      assetsRepository.find.mockResolvedValue([]);
      const actualUser = await usersService.restoreDeletedUser(
        mockUserEntity.id,
      );
      expect(actualUser).toEqual(mockUserEntity);
      expect(usersRepository.restore).toHaveBeenCalledWith(mockUserEntity.id);
    });
    it('throws a UserNotFoundException if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      expect(usersService.restoreDeletedUser('testUserId')).rejects.toThrow(
        UserNotFoundException,
      );
      expect(usersRepository.restore).not.toHaveBeenCalled();
    });
  });
});
