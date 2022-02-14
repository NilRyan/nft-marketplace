import { UserEntity } from 'src/users/entities/user.entity';
import { GqlAuthGuard } from './../auth/guards/graphql-jwt-auth.guard';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'getAllusers' })
  findAll(@GetUser() user: User) {
    return [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'hello@gmail.com',
      },
    ];
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.usersService.getUser(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
