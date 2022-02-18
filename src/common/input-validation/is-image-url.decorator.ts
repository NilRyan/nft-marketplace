import {
  isURL,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { fromStream } from 'file-type';
import got from 'got-cjs';

@ValidatorConstraint({ async: true })
export class IsImageUrlConstraint implements ValidatorConstraintInterface {
  async validate(imageUrl: string, args: ValidationArguments) {
    if (!isURL(imageUrl)) return false;

    const stream = got.stream(imageUrl, { throwHttpErrors: false });
    console.log(stream);
    const fileType = await fromStream(stream);
    if (fileType?.mime.startsWith('image/')) return true;
    return false;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Must be a valid Image URL';
  }
}

export function IsImageUrl(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsImageUrlConstraint,
    });
  };
}
