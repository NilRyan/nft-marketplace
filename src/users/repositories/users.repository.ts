import { EntityRepository, Repository } from 'typeorm';
import { RegisterUserInput } from '../dto/register-user.input';
import { UserEntity } from '../entities/user.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async createUser(registrationData: RegisterUserInput) {
    const newUser = this.create(registrationData);
    return await this.save(newUser);
  }
}
