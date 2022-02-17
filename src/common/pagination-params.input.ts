import { Field, InputType } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class PaginationParams {
  @Field({ defaultValue: 10 })
  @Min(1)
  limit: number;
  @Field({ defaultValue: 0 })
  @Min(0)
  offset: number;
}
