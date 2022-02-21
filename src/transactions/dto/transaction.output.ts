import { Field, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { Asset } from '../../assets/models/asset.model';
import { UserProfileOutput } from '../../users/dto/user-profile.output';
import Coin from '../../users/enums/coin.enum';

@ObjectType()
export class TransactionOutput {
  @Field()
  id: string;
  @Field((type) => Coin)
  coin: Coin;
  @Field()
  amount: number;
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field((type) => Asset)
  asset: Asset;
  @Field()
  assetId: string;
  @Field()
  buyer: UserProfileOutput;
  @Field()
  seller: UserProfileOutput;
}
