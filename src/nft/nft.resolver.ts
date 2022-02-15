import {
  UseGuards,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { NftService } from './nft.service';
import { CreateNftInput } from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { Nft } from './models/nft.model';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { NftNotFoundException } from './exceptions/nft-not-found.exception';
import RoleGuard from 'src/auth/guards/role.guards';
import Role from 'src/auth/enums/role.enum';
@UseGuards(GqlAuthGuard)
@Resolver((of) => Nft)
export class NftResolver {
  constructor(private readonly nftService: NftService) {}

  /*
    TODO:
      1. User must be able to post an NFT with required image, title, description, price
  */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Nft)
  createNft(
    @Args('createNftInput') createNftInput: CreateNftInput,
    @GetUser() user: UserEntity,
  ) {
    return this.nftService.createNft(createNftInput, user);
  }

  @Query(() => [Nft])
  getAllNfts() {
    return this.nftService.getNfts();
  }

  @Query(() => Nft)
  async getNftById(@Args('id', { type: () => ID }) id: string) {
    const nft = await this.nftService.getNftById(id);
    if (!nft) throw new NftNotFoundException(id);
    return nft;
  }

  @Mutation(() => Nft)
  async updateNft(
    @Args('updateNftInput') updateNftInput: UpdateNftInput,
    @GetUser() user: UserEntity,
  ) {
    await this.verifyIfUserIsAuthorized(updateNftInput.id, user);
    const updatedPost = await this.nftService.updateNft(updateNftInput);
    if (!updatedPost) throw new NftNotFoundException(updateNftInput.id);
    return updatedPost;
  }

  @Mutation(() => String)
  async removeNft(
    @Args('id', { type: () => ID }) nftId: string,
    @GetUser() user: UserEntity,
  ) {
    await this.verifyIfUserIsAuthorized(nftId, user);

    await this.nftService.removeNft(nftId);

    return `Nft with id: ${nftId} has been removed`;
  }

  private async verifyIfUserIsAuthorized(nftId: string, user: UserEntity) {
    const nft = await this.nftService.getNftById(nftId);
    if (!nft) throw new NftNotFoundException(nftId);
    if (nft.ownerId !== user.id || user.role !== Role.Admin) {
      throw new UnauthorizedException(
        `You are unable to update or delete NFT with id: ${nftId}`,
      );
    }
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Mutation(() => String)
  async restoreDeletedNft(@Args('id', { type: () => ID }) id: string) {
    const restoreResponse = await this.nftService.restoreDeletedNft(id);
    if (!restoreResponse.affected) throw new NftNotFoundException(id);

    return `Nft with id: ${id} has been restored`;
  }
}
