import { PaginatedAssets } from '../models/paginated-assets.model';
import { PaginationArgs } from '../../common/pagination-filtering/pagination.args';
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

import { CommentsService } from '../../comments/services/comments.service';
import { AssetsService } from '../services/assets.service';
import { CreateAssetInput } from '../dto/create-asset.input';
import { Asset } from '../models/asset.model';
import Role from '../../auth/enums/role.enum';
import { GetCurrentUser } from '../../auth/decorators/get-current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';
import RoleGuard from '../../auth/guards/role.guards';
import { AssetSearchArgs } from '../../common/pagination-filtering/asset-search.args';
import { UserEntity } from '../../users/entities/user.entity';
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
    @GetCurrentUser() user: UserEntity,
  ) {
    return this.assetsService.createAsset(createAssetInput, user);
  }

  @Query(() => PaginatedAssets)
  async getAllAssets(@Args() args: AssetSearchArgs) {
    return await this.assetsService.getAssets(args);
  }

  @Query(() => Asset)
  async getAssetById(@Args('assetId', { type: () => ID }) assetId: string) {
    return await this.assetsService.getAssetAndOwner(assetId);
  }

  @ResolveField('comments')
  async comments(@Parent() asset: Asset, @Args() args: PaginationArgs) {
    return await this.commentsService.getPaginatedCommentsForAsset(
      asset.id,
      args,
    );
  }

  @Mutation(() => Asset)
  async deleteAsset(
    @Args('id', { type: () => ID }) assetId: string,
    @GetCurrentUser() user: UserEntity,
  ) {
    return await this.assetsService.removeAsset(assetId, user);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Mutation(() => Asset)
  async restoreDeletedAsset(@Args('id', { type: () => ID }) id: string) {
    return await this.assetsService.restoreDeletedAsset(id);
  }
}
