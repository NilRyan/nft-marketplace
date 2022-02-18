import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OrderBy {
  // TODO: create enum for possible orderBy values
  @Field({ nullable: true, defaultValue: 'createdAt' })
  field?: string;
  @Field({ nullable: true, defaultValue: 'DESC' })
  sortOrder?: string;
}
