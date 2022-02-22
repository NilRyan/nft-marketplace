import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  Length,
  IsAlpha,
  IsEmail,
  MaxLength,
  IsOptional,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsAlphanumeric()
  @Length(4, 20)
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 60)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 60)
  lastName?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  @MaxLength(254)
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 1000)
  aboutMe?: string;
}
