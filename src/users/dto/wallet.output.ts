import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../models/user.model';

@ObjectType()
export class WalletOutput {
  @Field()
  id: string;

  @Field()
  address: string;

  @Field()
  balance: number;

  @Field(() => User)
  owner: User;

  @Field()
  userId: string;
}
