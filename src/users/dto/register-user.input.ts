import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';
import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import Gender from '../enums/gender.enum';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsAlphanumeric()
  @Length(4, 20)
  username: string;

  @Field()
  @Length(1, 60)
  firstName: string;

  @Field()
  @Length(1, 60)
  lastName: string;

  @Field()
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Field()
  @IsAlphanumeric()
  @Length(6, 20)
  password: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  birthDate: Date;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;
}
