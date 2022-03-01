import { Field, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import Gender from '../enums/gender.enum';

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

  @Field(() => GraphQLISODateTime, { nullable: true })
  birthDate?: Date;

  @Field(() => Gender)
  gender: Gender;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
