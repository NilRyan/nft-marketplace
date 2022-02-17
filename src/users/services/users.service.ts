import { UserNotFoundException } from './../exceptions/user-not-found.exception';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterUserInput } from 'src/auth/dto/register-user.input';
import Role from 'src/auth/enums/role.enum';
import { UpdateUserInput } from '../dto/update-user.input';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { WalletsService } from './wallets.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly walletsService: WalletsService,
  ) {}

  async createUserWithWallet(
    registrationData: RegisterUserInput,
  ): Promise<UserEntity> {
    const user = await this.userRepository.createUser(registrationData);
    const wallet = await this.walletsService.createWallet(user);
    user.wallet = wallet;
    user.walletId = wallet.id;
    return await this.userRepository.save(user);
  }
  async getAllUsers() {
    return await this.userRepository.find({
      relations: ['assets'],
    });
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id, {
      relations: ['wallet'],
    });

    return user;
  }

  async updateUser(updateUserInput: UpdateUserInput, user: UserEntity) {
    await this.userRepository.update(user.id, updateUserInput);
    const updatedUser = await this.userRepository.findOne(user.id, {
      relations: ['assets'],
    });
    return updatedUser;
  }

  async deleteUser(userId: string, user: UserEntity) {
    if (user.id !== userId || user.role !== Role.Admin) {
      throw new UnauthorizedException(
        `You can't delete user with id: ${userId}`,
      );
    }
    await this.userRepository.softDelete(userId);
    return user;
  }

  async restoreDeletedUser(userId: string) {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new UserNotFoundException(userId);
    await this.userRepository.restore(userId);

    return user;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
