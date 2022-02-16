import { UserProfileOutput } from 'src/users/dto/user-profile.output';
import { Field, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { Asset } from 'src/assets/models/asset.model';

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

  @Field((type) => Asset)
  asset: Asset;

  @Field()
  assetId: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
