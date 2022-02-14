import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}
}
