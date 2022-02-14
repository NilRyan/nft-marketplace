import { UserEntity } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/auth/get-user.decorator';
import { GqlAuthGuard } from './../auth/guards/graphql-jwt-auth.guard';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { UserProfileOutput } from './dto/user-profile.output';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserProfileOutput])
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Query(() => UserProfileOutput)
  getUserProfile(@Args('id', { type: () => String }) id: string) {
    return this.usersService.getUser(id);
  }

  @Mutation(() => UserProfileOutput)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.updateUser(updateUserInput);
  }

  @Mutation(() => String)
  removeUser(@Args('id', { type: () => String }) id: string) {
    this.usersService.removeUser(id);
    return `User with id: ${id} has been removed`;
  }

  // TODO: Role Admin only
  @Mutation(() => String)
  restoreDeletedUser(@Args('id', { type: () => String }) id: string) {
    this.usersService.restoreDeletedUser(id);
    return `User with id: ${id} has been restored`;
  }
}
