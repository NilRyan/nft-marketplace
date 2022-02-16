import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import Role from 'src/auth/enums/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import RoleGuard from 'src/auth/guards/role.guards';
import { UserEntity } from 'src/users/entities/user.entity';
import { AssetsService } from './assets.service';
import { CreateAssetInput } from './dto/create-asset.input';
import { Asset } from './models/asset.model';
@UseGuards(GqlAuthGuard)
@Resolver((of) => Asset)
export class AssetResolver {
  constructor(private readonly assetService: AssetsService) {}

  /*
    TODO:
      1. User must be able to post an NFT with required image, title, description, price
  */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Asset)
  createAsset(
    @Args('createAssetInput') createAssetInput: CreateAssetInput,
    @GetUser() user: UserEntity,
  ) {
    return this.assetService.createAsset(createAssetInput, user);
  }

  @Query(() => [Asset])
  getAllAssets() {
    return this.assetService.getAssets();
  }

  @Query(() => Asset)
  async getAssetById(@Args('id', { type: () => ID }) id: string) {
    return await this.assetService.getAssetById(id);
  }

  @Mutation(() => Asset)
  async deleteAsset(
    @Args('id', { type: () => ID }) assetId: string,
    @GetUser() user: UserEntity,
  ) {
    return await this.assetService.removeAsset(assetId, user);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Mutation(() => Asset)
  async restoreDeletedAsset(@Args('id', { type: () => ID }) id: string) {
    return await this.assetService.restoreDeletedAsset(id);
  }
}
