import { RegisterUserInput } from '../auth/dto/register-user.input';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/services/users.service';
import { AuthService } from './auth.service';

const mockConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_SECRET':
        return 'secret';
      case 'JWT_EXPIRY':
        return 86400;
    }
  },
};

const mockJwtService = {
  sign: () => '',
};
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
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
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
    it('returns the created User', async () => {
      const registrationData: RegisterUserInput = {
        username: 'philipcalape',
        password: 'password123',
        firstName: 'Philip',
        lastName: 'Calape',
        email: 'randomemail@gmail.com',
      };
      const expectedUser = new UserEntity();
      expectedUser.username = registrationData.username;
      expectedUser.firstName = registrationData.firstName;
      expectedUser.lastName = registrationData.lastName;
      expectedUser.email = registrationData.email;
      usersService.createUserWithWallet.mockResolvedValue(expectedUser);

      const actualUser = await authService.register(registrationData);
      expect(actualUser).toEqual(expectedUser);
    });
  });
});
