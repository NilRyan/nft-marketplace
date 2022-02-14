import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { NftService } from './nft.service';
import { CreateNftInput } from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { Nft } from './models/nft.model';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
@UseGuards(GqlAuthGuard)
@Resolver(() => Nft)
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
  getNftById(@Args('id', { type: () => ID }) id: string) {
    return this.nftService.getNftById(id);
  }

  @Mutation(() => Nft)
  updateNft(@Args('updateNftInput') updateNftInput: UpdateNftInput) {
    return this.nftService.updateNft(updateNftInput.id, updateNftInput);
  }

  @Mutation(() => String)
  removeNft(@Args('id', { type: () => ID }) id: string) {
    this.nftService.removeNft(id);
    return `Nft with id: ${id} has been removed`;
  }


}
