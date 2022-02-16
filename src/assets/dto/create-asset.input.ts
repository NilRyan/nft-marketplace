import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAssetInput {
  @Field()
  readonly imageUrl: string;
  @Field()
  readonly title: string;
  @Field()
  readonly description: string;
  @Field()
  readonly category: string;
  @Field()
  readonly price: number;
}
