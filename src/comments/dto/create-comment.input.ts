import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  comment: string;

  @Field()
  assetId: string;
}
