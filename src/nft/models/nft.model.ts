import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comments/models/comment.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Nft {
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

  @Field()
  category: string;

  @Field((type) => User)
  owner: User;

  @Field()
  ownerId: string;

  @Field((type) => [Comment])
  comments: Comment[];
}
