import { CreateNftInput } from './create-nft.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNftInput extends PartialType(CreateNftInput) {
  @Field()
  id: string;
}
