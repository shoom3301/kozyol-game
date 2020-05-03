import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Game } from './game.entity';

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private gameRepository: Repository<Game>) {}

  async create(payload: any): Promise<Game> {
    return this.gameRepository.save(payload);
  }

  async availableGames() {
    // return this.gameRepository.query(
    //   'select * from game where slotsCount > playersCount or playersCount is null;',
    //   [{ relations: ['owner'] }],
    // );
    return this.gameRepository
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.owner', 'owner')
      .where('slotsCount > playersCount')
      .orWhere('playersCount is null')
      .getMany();
  }
}
