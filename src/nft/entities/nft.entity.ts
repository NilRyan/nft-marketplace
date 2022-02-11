import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Nft {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
