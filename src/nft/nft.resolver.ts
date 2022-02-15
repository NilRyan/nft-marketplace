import { UseGuards, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { NftService } from './nft.service';
import { CreateNftInput } from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { Nft } from './models/nft.model';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { NftNotFoundException } from './exceptions/nft-not-found.exception';
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
  async updateNft(@Args('updateNftInput') updateNftInput: UpdateNftInput) {
    const updatedPost = await this.nftService.updateNft(updateNftInput);
    if (!updatedPost) throw new NftNotFoundException(updateNftInput.id);
    return updatedPost;
  }

  @Mutation(() => String)
  async removeNft(@Args('id', { type: () => ID }) id: string) {
    const deleteResponse = await this.nftService.removeNft(id);
    if (!deleteResponse.affected) throw new NftNotFoundException(id);

    return `Nft with id: ${id} has been removed`;
  }

  @Mutation(() => String)
  async restoreDeletedNft(@Args('id', { type: () => ID }) id: string) {
    const restoreResponse = await this.nftService.restoreDeletedNft(id);
    if (!restoreResponse.affected) throw new NftNotFoundException(id);

    return `Nft with id: ${id} has been restored`;
  }
}
