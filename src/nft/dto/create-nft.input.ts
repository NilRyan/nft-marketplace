import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNftInput {
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
