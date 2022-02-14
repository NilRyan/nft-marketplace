import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserProfileOutput {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  aboutMe?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
