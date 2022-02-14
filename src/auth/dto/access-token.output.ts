import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessTokenOutput {
  @Field()
  readonly accessToken: string;
}
