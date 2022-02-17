import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationInfo {
  @Field()
  total: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  offset?: number;
}
