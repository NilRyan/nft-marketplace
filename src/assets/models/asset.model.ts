import { UserProfileOutput } from '../../users/dto/user-profile.output';
import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comments/models/comment.model';

@ObjectType()
export class Asset {
  @Field()
  id: string;

  @Field()
  imageUrl: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: string;

  @Field({ nullable: true })
  category?: string;

  @Field((type) => UserProfileOutput)
  owner: UserProfileOutput;

  @Field()
  ownerId: string;

  @Field((type) => [Comment], { nullable: true })
  comments?: Comment[];
}
