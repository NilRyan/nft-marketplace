import { Asset } from 'src/assets/models/asset.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationInfo } from 'src/common/pagination-info.output';

@ObjectType()
export class PaginatedAssets extends Asset {
  @Field()
  paginationInfo: PaginationInfo;

  @Field(() => [Asset])
  assets: [Asset];
}
