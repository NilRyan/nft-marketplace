import {
  Field,
  GraphQLISODateTime,
  InputType,
  PartialType,
} from '@nestjs/graphql';
import {
  IsAlphanumeric,
  Length,
  IsAlpha,
  IsEmail,
  MaxLength,
  IsOptional,
  IsDate,
} from 'class-validator';
import Gender from '../enums/gender.enum';

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

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @Field(() => Gender, { nullable: true })
  @IsOptional()
  gender?: Gender;
}
