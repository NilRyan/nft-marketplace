import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  comment: string;
}
