import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { RegisterUserInput } from '../../users/dto/register-user.input';
import { LoginInput } from '../dto/login.input';
import { AccessTokenOutput } from '../dto/access-token.output';
import { User } from '../../users/models/user.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query((returns) => AccessTokenOutput)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation((returns) => User)
  register(@Args('registerUserInput') registerUserInput: RegisterUserInput) {
    return this.authService.register(registerUserInput);
  }
}
