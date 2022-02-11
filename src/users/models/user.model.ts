import { Field, ObjectType } from '@nestjs/graphql';
import { Nft } from 'src/nft/models/nft.model';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  aboutMe: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  balance: string;

  @Field(() => [Nft])
  nfts?: Nft[];
}
