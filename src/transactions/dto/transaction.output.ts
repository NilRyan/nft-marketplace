import { UserProfileOutput } from 'src/users/dto/user-profile.output';
import { Field, ObjectType } from '@nestjs/graphql';
import { Nft } from 'src/nft/models/nft.model';
import Coin from 'src/users/enums/coin.enum';

@ObjectType()
export class TransactionOutput {
  @Field()
  id: number;
  @Field((type) => Coin)
  coin: Coin;
  @Field()
  amount: number;
  @Field()
  transactionDate: string;
  @Field((type) => Nft)
  nft: Nft;
  @Field()
  nftId: string;
  @Field()
  buyer: UserProfileOutput;
  @Field()
  seller: UserProfileOutput;
}
