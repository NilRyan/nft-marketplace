import { AssetsRepository } from './../../assets/repositories/assets.repository';
import { UserNotFoundException } from './../exceptions/user-not-found.exception';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateUserInput } from '../dto/update-user.input';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { WalletsService } from './wallets.service';
import { RegisterUserInput } from '../dto/register-user.input';
import Role from '../../auth/enums/role.enum';
import PostgresErrorCode from '../../database/enums/postgres-error-code.enum';
import { UserNotDeletedException } from '../exceptions/user-not-deleted.exception';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly assetsRepository: AssetsRepository,
    private readonly walletsService: WalletsService,
  ) {}

  async createUserWithWallet(
    registrationData: RegisterUserInput,
  ): Promise<UserEntity> {
    const user = await this.userRepository.createUser(registrationData);
    const wallet = await this.walletsService.createWallet(user);
    user.wallet = wallet;
    user.walletId = wallet.id;
    await this.userRepository.save(user);
    return user;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id, {
      relations: ['wallet'],
    });

    return user;
  }

  async updateUser(updateUserInput: UpdateUserInput, user: UserEntity) {
    try {
      await this.userRepository.update(user.id, updateUserInput);
    } catch (err) {
      if (err?.code === PostgresErrorCode.UniqueViolation) {
        throw new ForbiddenException(
          "Can't update user with given username or email",
        );
      }
    }

    const updatedUser = await this.userRepository.findOne(user.id, {
      relations: ['assets'],
    });
    return updatedUser;
  }

  async deleteUser(userId: string, user: UserEntity) {
    const assets = await this.assetsRepository.find({
      where: { owner: userId },
    });
    if (user.id === userId) {
      await this.userRepository.softRemove(assets);
      await this.assetsRepository.softRemove(assets);
      return user;
    } else if (user.role === Role.Admin) {
      const userToDelete = await this.userRepository.findOne(userId);
      if (!userToDelete) throw new UserNotFoundException(userId);
      await this.userRepository.softDelete(userId);
      await this.assetsRepository.softRemove(assets);
      return userToDelete;
    }
    throw new UnauthorizedException(`You can't delete user with id: ${userId}`);
  }

  async restoreDeletedUser(userId: string) {
    const deletedUser = await this.userRepository.findOne(userId, {
      withDeleted: true,
    });

    if (!deletedUser) throw new UserNotFoundException(userId);
    if (deletedUser.deletedAt === null) {
      throw new UserNotDeletedException(userId);
    }
    const assets = await this.assetsRepository.find({
      where: { owner: userId },
      withDeleted: true,
    });
    const assetIds = assets.map((asset) => asset.id);
    await this.userRepository.restore(userId);
    await this.assetsRepository.restore(assetIds);

    return deletedUser;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
