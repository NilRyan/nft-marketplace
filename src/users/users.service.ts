import { Injectable, Logger } from '@nestjs/common';
import { RegisterUserInput } from 'src/auth/dto/register-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from './entities/user.entity';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async create(registrationData: RegisterUserInput): Promise<UserEntity> {
    return await this.userRepository.save(registrationData);
  }
  async getAllUsers() {
    return await this.userRepository.find({
      relations: ['nfts'],
    });
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id, {
      relations: ['nfts'],
    });

    if (!user) {
      this.logger.warn(`User with id: ${id} not found`);
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async updateUser(updateUserInput: UpdateUserInput) {
    const { id } = updateUserInput;
    await this.userRepository.update(id, updateUserInput);
    const updatedUser = await this.userRepository.findOne(id, {
      relations: ['nfts'],
    });

    if (!updatedUser) {
      this.logger.warn(`User with id: ${id} not found`);
      throw new UserNotFoundException(id);
    }
    return updatedUser;
  }

  async removeUser(id: string) {
    const deleteResponse = await this.userRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async restoreDeletedUser(id: string) {
    const restoreResponse = await this.userRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { username } });
  }

}
