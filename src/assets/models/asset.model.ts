import { PaginatedComments } from './../../comments/dto/paginated-comments.output';
import { UserProfileOutput } from '../../users/dto/user-profile.output';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
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
  lastSale?: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field({ nullable: true })
  category?: string;

  @Field(() => UserProfileOutput)
  creator: UserProfileOutput;

  @Field()
  creatorId: string;

  @Field((type) => UserProfileOutput)
  owner: UserProfileOutput;

  @Field()
  ownerId: string;

  @Field((type) => PaginatedComments, { nullable: true })
  comments?: PaginatedComments;
}
