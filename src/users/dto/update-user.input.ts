import { InputType, PartialType } from '@nestjs/graphql';
import { RegisterUserInput } from '../../auth/dto/register-user.input';

@InputType()
export class UpdateUserInput extends PartialType(RegisterUserInput) {}
