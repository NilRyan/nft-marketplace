import { Field, ObjectType } from '@nestjs/graphql';
import { Nft } from 'src/nft/models/nft.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Comment {
  @Field()
  id: string;

  @Field()
  comment: string;

  @Field((type) => User)
  user: User;

  @Field()
  userId: string;

  @Field((type) => Nft)
  nft: Nft;

  @Field()
  nftId: string;
}
