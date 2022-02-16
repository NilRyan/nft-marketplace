import { RegisterUserInput } from 'src/auth/dto/register-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(RegisterUserInput) {}
