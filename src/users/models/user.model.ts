import { Field, ObjectType } from '@nestjs/graphql';
import { Asset } from 'src/assets/models/asset.model';

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

  @Field(() => [Asset])
  assets?: Asset[];
}
