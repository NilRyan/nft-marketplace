import { IsImageUrl } from 'src/common/input-validation/is-image-url.decorator';
import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive, Length } from 'class-validator';

@InputType()
export class CreateAssetInput {
  // TODO: Create custom validator for image-url, use library like file-type
  @Field()
  @IsImageUrl({ message: 'Must be a valid Image URL' })
  readonly imageUrl: string;
  @Field()
  @Length(1, 255, {
    message: 'Title must be between 1 and 255 characters',
  })
  readonly title: string;
  @Field()
  @Length(1, 1000, {
    message: 'Description must be between 1 and 1000 characters',
  })
  readonly description: string;
  @Field()
  @Length(1, 255)
  readonly category: string;
  @IsNumber()
  @IsPositive()
  @Field()
  readonly price: number;
}
