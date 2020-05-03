import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(login: string, password: string): Promise<User> {
    const user = await this.userRepository.save({
      login,
      password,
    });

    return user;
  }

  async getByLogin(login: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { login } });
    return user;
  }
}
