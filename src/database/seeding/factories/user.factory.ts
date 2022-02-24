import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import Role from '../../../auth/enums/role.enum';
import { UserEntity } from '../../../users/entities/user.entity';
import Gender from '../../../users/enums/gender.enum';

define(UserEntity, (faker: typeof Faker) => {
  const user = new UserEntity();
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.username = faker.internet.userName();
  user.birthDate = faker.date.past();
  user.gender = Gender.Male;
  user.role = Role.Admin;
  user.aboutMe = faker.lorem.sentence();
  const createdAt = new Date();
  user.createdAt = createdAt;
  user.updatedAt = createdAt;
  return user;
});
