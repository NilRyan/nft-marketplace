import { RegisterUserInput } from '../../users/dto/register-user.input';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from './auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from '../dto/login.input';
import PostgresErrorCode from '../../database/enums/postgres-error-code.enum';
import Gender from '../../users/enums/gender.enum';

const mockConfigService = () => ({
  get(key: string) {
    switch (key) {
      case 'JWT_SECRET':
        return 'secret';
      case 'JWT_EXPIRY':
        return 86400;
    }
  },
});

const mockJwtService = () => ({
  signAsync: jest.fn(),
});

const mockUsersService = () => ({
  getUserByUsername: jest.fn(),
  getUserById: jest.fn(),
  createUserWithWallet: jest.fn(),
});

describe('Authentication Service', () => {
  let authService: AuthService;
  let usersService;
  let jwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('returns the created UserEntity without the password', async () => {
      const registrationData: RegisterUserInput = {
        username: 'philipcalape',
        password: 'password123',
        firstName: 'Philip',
        lastName: 'Calape',
        email: 'randomemail@gmail.com',
        birthDate: new Date(),
        gender: Gender.Male,
      };
      const expectedUser = { ...registrationData };
      usersService.createUserWithWallet.mockResolvedValue(expectedUser);

      const actualUser = await authService.register(registrationData);
      expect(actualUser).toEqual(expectedUser);
      expect(actualUser.password).toBeUndefined();
    });
    it('throws a 400 Bad Request if username or email is taken', async () => {
      const uniqueViolationError = new Error('UniqueViolation') as any;
      uniqueViolationError.code = PostgresErrorCode.UniqueViolation;
      usersService.createUserWithWallet.mockRejectedValue(uniqueViolationError);

      await expect(
        authService.register({
          username: 'philipcalape',
          password: 'password123',
          firstName: 'Philip',
          lastName: 'Calape',
          email: 'randomemail@gmail.com',
        } as RegisterUserInput),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('login', () => {
    it('returns token if authenticated', async () => {
      const loginInput: LoginInput = {
        username: 'neilryan',
        password: 'password123',
      };
      usersService.getUserByUsername.mockResolvedValue({
        username: 'neilryan',
        password:
          '$2a$10$VbunJyso/iScp92zRroc6.TiK6FLUY2kRfNvWFANbwUbiyn3Emw16', // password hash of 'password123'
      });
      await jwtService.signAsync.mockResolvedValue('token');
      const actualResult = await authService.login(loginInput);
      expect(actualResult).toEqual({ accessToken: 'token' });
    });

    it('throws a 400 Bad Request if user does not exist in the database', async () => {
      usersService.getUserByUsername.mockResolvedValue(null);
      const loginInput: LoginInput = {
        username: 'philipcalape',
        password: 'password123',
      };
      await expect(authService.login(loginInput)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('throws a 401 Exception if password is invalid', async () => {
      usersService.getUserByUsername.mockResolvedValue({
        username: 'neilryan',
        password:
          '$2a$10$VbunJyso/iScp92zRroc6.TiK6FLUY2kRfNvWFANbwUbiyn3Emw16',
      });
      const loginInput: LoginInput = {
        username: 'neilryan',
        password: 'wrongpassword',
      };
      await expect(authService.login(loginInput)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });
});
