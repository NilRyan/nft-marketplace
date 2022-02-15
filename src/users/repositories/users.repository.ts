import { RegisterUserInput } from 'src/auth/dto/register-user.input';
import { UserEntity } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async createUser(registrationData: RegisterUserInput) {
    const newUser = this.create(registrationData);
    return await this.save(newUser);
  }
}
