import { Injectable } from '@nestjs/common';
import { omit } from 'ramda';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(login: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.getByLogin(login);
    if (password && password !== '' && user?.password === password) {
      return omit(['password'], user);
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.login, sub: user.id };
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
    };
  }
}
