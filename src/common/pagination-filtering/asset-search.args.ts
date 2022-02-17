import { PaginationArgs } from './pagination.args';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class AssetSearchArgs extends PaginationArgs {
  @Field()
  searchTerm: string;
}
