import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { Game } from './game.entity';

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private gameRepository: Repository<Game>) {}

  async create(payload: any): Promise<Game> {
    const { id } = await this.gameRepository.save(payload);

    return this.gameRepository.findOne(id);
  }

  async availableGames() {
    // so dirty
    const games = await this.gameRepository.find();

    return games.filter(game => game.hasAvailableSlots());
  }

  async connectUserToGame(userId: number, gameId: number) {
    const game = await this.gameRepository.findOne(gameId);
    console.log({ game });

    if (!game) {
      throw new HttpException('game not found', HttpStatus.NOT_FOUND);
    }

    if (game.hasPlayer(userId)) {
      console.log('already in game');
      return game;
    }

    if (!game.hasAvailableSlots()) {
      throw new HttpException('no available slots', HttpStatus.FORBIDDEN);
    }

    game.players.push({ id: userId } as User);
    await this.gameRepository.save(game);

    return this.gameRepository.findOne(gameId);
  }
}
