import { LoginInput } from './dto/login.input';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserInput } from './dto/register-user.input';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/database/postgres-error-code.enum';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/services/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registrationData: RegisterUserInput) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    console.log(hashedPassword);
    try {
      const createdUser = await this.usersService.createUserWithWallet({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (err) {
      if (err?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Username or email already taken',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginInput: LoginInput) {
    const { username, password } = loginInput;
    const user = await this.usersService.getUserByUsername(username);
    if (!user) throw new BadRequestException('Invalid credentials');

    await this.verifyPassword(password, user.password);
    const { id, firstName, lastName, email } = user;
    const payload = { id, username, firstName, lastName, email };
    const accessToken: string = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async getUserFromJwt(token: string) {
    const { id } = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    if (!id) throw new UnauthorizedException('Invalid token');
    return await this.usersService.getUserById(id);
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
