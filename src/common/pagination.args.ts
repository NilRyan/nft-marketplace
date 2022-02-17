import { ArgsType, Field } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { OrderBy } from './order-by.input';

@ArgsType()
export class PaginationArgs {
  @Field({ defaultValue: 10, nullable: true })
  @Min(1)
  limit?: number;
  @Field({ defaultValue: 0, nullable: true })
  @Min(0)
  offset?: number;

  @Field(() => OrderBy, {
    defaultValue: { field: 'createdAt', sortOrder: 'DESC' },
    nullable: true,
  })
  orderBy?: OrderBy;
}
