import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  Length,
  MaxLength,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsAlphanumeric()
  @Length(4, 20)
  username: string;

  @Field()
  @IsAlpha()
  @Length(1, 60)
  firstName: string;

  @Field()
  @IsAlpha()
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
}
