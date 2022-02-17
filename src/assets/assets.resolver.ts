import { PaginationArgs } from './../common/pagination.args';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import Role from 'src/auth/enums/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import RoleGuard from 'src/auth/guards/role.guards';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommentsService } from './../comments/services/comments.service';
import { AssetsService } from './assets.service';
import { CreateAssetInput } from './dto/create-asset.input';
import { Asset } from './models/asset.model';
@UseGuards(GqlAuthGuard)
@Resolver((of) => Asset)
export class AssetResolver {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly commentsService: CommentsService,
  ) {}

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
    return this.assetsService.createAsset(createAssetInput, user);
  }

  @Query(() => [Asset])
  getAllAssets() {
    return this.assetsService.getAssets();
  }

  @Query(() => Asset)
  async getAssetById(@Args('assetId', { type: () => ID }) assetId: string) {
    return await this.assetsService.getAssetById(assetId);
  }

  @ResolveField('comments')
  async comments(@Parent() asset: Asset, @Args() args: PaginationArgs) {
    return await this.commentsService.getCommentsForAsset(asset.id, args);
  }

  @Mutation(() => Asset)
  async deleteAsset(
    @Args('id', { type: () => ID }) assetId: string,
    @GetUser() user: UserEntity,
  ) {
    return await this.assetsService.removeAsset(assetId, user);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Mutation(() => Asset)
  async restoreDeletedAsset(@Args('id', { type: () => ID }) id: string) {
    return await this.assetsService.restoreDeletedAsset(id);
  }
}
