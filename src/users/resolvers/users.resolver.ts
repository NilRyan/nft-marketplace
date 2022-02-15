import RoleGuard from 'src/auth/guards/role.guards';
import { UserEntity } from 'src/users/entities/user.entity';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/auth/get-user.decorator';
import Role from 'src/auth/enums/role.enum';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { UpdateUserInput } from '../dto/update-user.input';
import { UserProfileOutput } from '../dto/user-profile.output';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';

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
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetUser() user: UserEntity,
  ) {
    if (user.id !== updateUserInput.id) {
      throw new UnauthorizedException(
        `You can't update user with id: ${updateUserInput.id}`,
      );
    }

    const updatedUser = await this.usersService.updateUser(updateUserInput);
    if (!updatedUser) throw new UserNotFoundException(updateUserInput.id);

    return updatedUser;
  }

  @Mutation(() => String)
  async removeUser(
    @Args('id', { type: () => String }) id: string,
    @GetUser() user: UserEntity,
  ) {
    if (user.id !== id || user.role !== Role.Admin) {
      throw new UnauthorizedException(`You can't delete user with id: ${id}`);
    }
    const deleteResponse = await this.usersService.removeUser(id);
    if (!deleteResponse.affected) throw new UserNotFoundException(id);
    return `User with id: ${id} has been removed`;
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Mutation(() => String)
  async restoreDeletedUser(@Args('id', { type: () => String }) id: string) {
    const restoreResponse = await this.usersService.restoreDeletedUser(id);
    if (!restoreResponse.affected) throw new UserNotFoundException(id);

    return `User with id: ${id} has been restored`;
  }
}
