import {
  UseGuards,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';
import { Asset } from './models/asset.model';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { AssetNotFoundException } from './exceptions/asset-not-found.exception';
import RoleGuard from 'src/auth/guards/role.guards';
import Role from 'src/auth/enums/role.enum';
import { AssetsService } from './assets.service';
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
    const asset = await this.assetService.getAssetById(id);
    if (!asset) throw new AssetNotFoundException(id);
    return asset;
  }

  @Mutation(() => Asset)
  async updateAsset(
    @Args('updateAssetInput') updateAssetInput: UpdateAssetInput,
    @GetUser() user: UserEntity,
  ) {
    await this.verifyIfUserIsAuthorized(updateAssetInput.id, user);
    const updatedPost = await this.assetService.updateAsset(updateAssetInput);
    if (!updatedPost) throw new AssetNotFoundException(updateAssetInput.id);
    return updatedPost;
  }

  @Mutation(() => String)
  async removeAsset(
    @Args('id', { type: () => ID }) assetId: string,
    @GetUser() user: UserEntity,
  ) {
    await this.verifyIfUserIsAuthorized(assetId, user);

    await this.assetService.removeAsset(assetId);

    return `Asset with id: ${assetId} has been removed`;
  }

  private async verifyIfUserIsAuthorized(assetId: string, user: UserEntity) {
    const asset = await this.assetService.getAssetById(assetId);
    if (!asset) throw new AssetNotFoundException(assetId);
    if (asset.ownerId !== user.id || user.role !== Role.Admin) {
      throw new UnauthorizedException(
        `You are unable to update or delete NFT with id: ${assetId}`,
      );
    }
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Mutation(() => String)
  async restoreDeletedAsset(@Args('id', { type: () => ID }) id: string) {
    const restoreResponse = await this.assetService.restoreDeletedAsset(id);
    if (!restoreResponse.affected) throw new AssetNotFoundException(id);

    return `Asset with id: ${id} has been restored`;
  }
}
