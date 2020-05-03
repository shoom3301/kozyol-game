import { Injectable } from '@nestjs/common';
import { omit } from 'ramda';

import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(login: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.getByLogin(login);
    console.log({ user });
    if (password && password !== '' && user?.password === password) {
      console.log('matched');
      return omit(['password'], user);
    }
    return null;
  }
}
