import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  readonly username: string;

  @Field()
  readonly password: string;
}
