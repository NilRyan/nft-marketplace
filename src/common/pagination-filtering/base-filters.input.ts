import { Field, InputType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';

@InputType()
export class BaseFilters {
  @Field({ nullable: true })
  @IsDate()
  createdAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  updatedAt?: Date;
}
