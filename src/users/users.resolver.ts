import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from './../auth/guards/graphql-jwt-auth.guard';
import { UpdateUserInput } from './dto/update-user.input';
import { UserProfileOutput } from './dto/user-profile.output';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserProfileOutput])
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Query(() => UserProfileOutput)
  async getUserProfile(@Args('id', { type: () => String }) id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) throw new UserNotFoundException(id);

    return user;
  }

  @Mutation(() => UserProfileOutput)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const updatedUser = await this.usersService.updateUser(updateUserInput);
    if (!updatedUser) throw new UserNotFoundException(updateUserInput.id);

    return updatedUser;
  }

  @Mutation(() => String)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    const deleteResponse = await this.usersService.removeUser(id);
    if (!deleteResponse.affected) throw new UserNotFoundException(id);
    return `User with id: ${id} has been removed`;
  }

  // TODO: Role Admin only
  @Mutation(() => String)
  async restoreDeletedUser(@Args('id', { type: () => String }) id: string) {
    const restoreResponse = await this.usersService.restoreDeletedUser(id);
    if (!restoreResponse.affected) throw new UserNotFoundException(id);

    return `User with id: ${id} has been restored`;
  }
}
