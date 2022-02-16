import { UserProfileOutput } from 'src/users/dto/user-profile.output';
import { Field, ObjectType } from '@nestjs/graphql';
import Coin from 'src/users/enums/coin.enum';
import { Asset } from 'src/assets/models/asset.model';

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
  @Field((type) => Asset)
  asset: Asset;
  @Field()
  assetId: string;
  @Field()
  buyer: UserProfileOutput;
  @Field()
  seller: UserProfileOutput;
}
