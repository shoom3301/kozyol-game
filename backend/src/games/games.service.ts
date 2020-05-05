/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, HttpException, HttpStatus, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { Game } from './entities/game';

import { startGame } from './helpers/startGame';

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private gameRepository: Repository<Game>) {}

  async gameById(gameId: number) {
    const game = await this.gameRepository.findOne(gameId, { relations: ['sets'] });

    if (!game) {
      throw new HttpException('no game found', HttpStatus.NOT_FOUND);
    }

    return game;
  }

  async create(payload: any): Promise<Game | undefined> {
    const { id } = await this.gameRepository.save(payload);

    return this.gameRepository.findOne(id);
  }

  async availableGames() {
    // so dirty
    const games = await this.gameRepository.find();

    return games.filter(game => game.hasAvailableSlots());
  }

  async connectUserToGame(userId: number, gameId: number) {
    let game = await this.gameRepository.findOne(gameId, { relations: ['sets'] });

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

    game = await this.gameRepository.findOne(gameId, { relations: ['sets'] });

    if (!game.hasAvailableSlots()) {
      game = await startGame(game);
      await this.gameRepository.save(game);
    }

    return game;
  }
}
