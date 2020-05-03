import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(login: string, password: string): Promise<User> {
    const user = await this.userRepository.save({
      login,
      password,
    });

    return user;
  }

  async getByLogin(login: string): Promise<User | undefined> {
    console.log({ login });

    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('user.id')
      .addSelect('user.password')
      .addSelect('user.login')
      .where('user.login = :login', { login })
      .printSql()
      .getOne();

    return user;
  }
}
