import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsNumber, IsPositive, Length } from 'class-validator';

@InputType()
export class CreateAssetInput {
  // TODO: Create custom validator for image-url, use library like file-type
  @Field()
  readonly imageUrl: string;
  @IsAlphanumeric()
  @Field()
  @Length(1, 255, {
    message: 'Title must be between 1 and 255 characters',
  })
  readonly title: string;
  @Field()
  @IsAlphanumeric()
  @Length(1, 1000, {
    message: 'Description must be between 1 and 1000 characters',
  })
  readonly description: string;
  @Field()
  @IsAlphanumeric()
  @Length(1, 255)
  readonly category: string;
  @IsNumber()
  @IsPositive()
  @Field()
  readonly price: number;
}
