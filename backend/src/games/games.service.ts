/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository, Connection } from 'typeorm';

import { User } from '../user/user.entity';
import { Game } from './entities/game';

import { startGame } from './helpers/startGame';
import { prop, concat } from 'ramda';
import { broadcastGamesList } from 'src/subscribe/subscribe.controller';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private connection: Connection,
  ) {}

  async gameById(gameId: number) {
    const game = await this.gameRepository.findOne(gameId, { relations: ['sets', 'players'] });

    if (!game) {
      throw new HttpException('no game found', HttpStatus.NOT_FOUND);
    }

    return game;
  }

  async create(payload: any): Promise<Game | undefined> {
    const { id } = await this.gameRepository.save({ ...payload, waitConfirmations: [] });

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

    await game.reload();

    if (!game.hasAvailableSlots()) {
      game = await startGame(game);
      await game.save();
    }

    return game;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanAbandonedGames() {
    const abandonedGames = await this.connection.query(
      'SELECT gameId FROM `set` where (UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(updatedAt)) > 600 and finished = false;',
    );

    const notStartedGamesQuery =
      'select `g`.`id`, count(`s`.`id`) as `setsCount` ' +
      'from `game` `g` ' +
      'left join `set` `s` on `g`.`id` = `s`.`gameId`  ' +
      'where UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(`g`.`createdAt`) > 600 ' +
      'group by `g`.`id` ' +
      'having `setsCount` = 0;';
    const notStartedGames = await this.connection.query(notStartedGamesQuery);

    const gamesForDelete = notStartedGames
      .map(prop('id'))
      .concat(abandonedGames.map(prop('gameId')));
    this.logger.debug(`games for delete ${gamesForDelete}`);
    if (gamesForDelete.length > 0) {
      await Game.delete(gamesForDelete);
      await broadcastGamesList();
    }
  }
}
