import { Field, ObjectType } from '@nestjs/graphql';
import Coin from '../enums/coin.enum';
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
  ownerId: string;

  @Field(() => Coin)
  coin: Coin;
}
