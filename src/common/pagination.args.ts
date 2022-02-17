import { ArgsType, Field } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field({ defaultValue: 10, nullable: true })
  @Min(1)
  limit?: number;
  @Field({ defaultValue: 0, nullable: true })
  @Min(0)
  offset?: number;

  @Field({ defaultValue: 'createdAt', nullable: true })
  orderBy?: string;
}
