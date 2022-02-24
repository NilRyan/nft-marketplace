import { Field, InputType } from '@nestjs/graphql';
import Direction from './enums/direction.enums';

@InputType()
export class OrderBy {
  // TODO: create enum for possible orderBy values
  @Field({ nullable: true, defaultValue: 'createdAt' })
  field?: string;
  @Field({ nullable: true, defaultValue: Direction.DESC })
  direction?: Direction;
}
