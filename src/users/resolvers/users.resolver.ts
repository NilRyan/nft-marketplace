import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import Role from '../../auth/enums/role.enum';
import { GetCurrentUser } from '../../auth/decorators/get-current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';
import RoleGuard from '../../auth/guards/role.guards';

import { UpdateUserInput } from '../dto/update-user.input';
import { UserProfileOutput } from '../dto/user-profile.output';
import { UserEntity } from '../entities/user.entity';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Query(() => [UserProfileOutput])
  // getAllUsers() {
  //   return this.usersService.getAllUsers();
  // }

  @Query(() => UserProfileOutput)
  async getUserProfile(@Args('id', { type: () => String }) id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) throw new UserNotFoundException(id);

    return user;
  }

  @Mutation(() => UserProfileOutput)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetCurrentUser() user: UserEntity,
  ) {
    return await this.usersService.updateUser(updateUserInput, user);
  }

  @Mutation(() => UserProfileOutput)
  async deleteUser(
    @Args('userId', { type: () => String }) userId: string,
    @GetCurrentUser() user: UserEntity,
  ) {
    return await this.usersService.deleteUser(userId, user);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Mutation(() => UserProfileOutput)
  async restoreDeletedUser(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return await this.usersService.restoreDeletedUser(userId);
  }
}
