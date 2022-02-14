import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserInput } from 'src/auth/dto/register-user.input';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from './entities/user.entity';
import { User } from './models/user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(registrationData: RegisterUserInput): Promise<UserEntity> {
    return await this.userRepository.save(registrationData);
  }
  async getAllUsers() {
    return await this.userRepository.find();
  }

  async getUser(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
