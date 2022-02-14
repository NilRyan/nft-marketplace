import { UserProfileOutput } from 'src/users/dto/user-profile.output';
import { DateScalarMode, Field, ObjectType } from '@nestjs/graphql';
import { Nft } from 'src/nft/models/nft.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Comment {
  @Field()
  id: string;

  @Field()
  comment: string;

  @Field((type) => UserProfileOutput)
  author: UserProfileOutput;

  @Field()
  authorId: string;

  @Field((type) => Nft)
  nft: Nft;

  @Field()
  nftId: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
