import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationInfo {
  @Field()
  total: number;
  @Field()
  limit: number;
  @Field()
  offset: number;
}
