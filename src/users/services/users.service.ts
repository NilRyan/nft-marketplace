import { Injectable, Logger } from '@nestjs/common';
import { RegisterUserInput } from 'src/auth/dto/register-user.input';
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
      relations: ['assets'],
    });

    return user;
  }

  async updateUser(updateUserInput: UpdateUserInput) {
    const { id } = updateUserInput;
    await this.userRepository.update(id, updateUserInput);
    const updatedUser = await this.userRepository.findOne(id, {
      relations: ['assets'],
    });
    return updatedUser;
  }

  async removeUser(id: string) {
    return await this.userRepository.softDelete(id);
  }

  async restoreDeletedUser(id: string) {
    return await this.userRepository.restore(id);
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
