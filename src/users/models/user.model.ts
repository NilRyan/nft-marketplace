import { Field, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { Asset } from '../../assets/models/asset.model';
import Gender from '../enums/gender.enum';

@ObjectType()
export class User {
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

  @Field()
  balance: number;

  @Field(() => GraphQLISODateTime)
  birthDate: Date;

  @Field(() => Gender)
  gender: Gender;

  @Field(() => [Asset])
  assets?: Asset[];
}
