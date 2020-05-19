// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types.d.ts" />

import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import PQueue from 'p-queue';

import { GamesService } from './games.service';
import { UserService } from '../user/user.service';
import { continueGame } from './helpers/continueGame';
import { Game } from './entities/game';
import { without } from 'ramda';
import { GameGuard } from './games.guard';
import { broadcastGamesList, broadcastGameState } from 'src/subscribe/subscribe.controller';

@UseGuards(JwtAuthGuard)
@Controller('api/games')
export class GamesController {
  constructor(private gameService: GamesService, private userService: UserService) {}

  @Get('list')
  getGames() {
    return this.gameService.availableGames();
  }

  @UseGuards(GameGuard)
  @Get(':gameId')
  async gameById(@Req() req: Request, @Param('gameId') gameId?: number) {
    return this.gameService.gameById(gameId);
  }

  @Post('create')
  async createGame(@Req() req: Request) {
    console.log(req.user);
    const game = await this.gameService.create({
      owner: { id: req.user.id },
      slotsCount: req.body.slotsCount,
    });
    await broadcastGamesList();
    return game;
  }

  @Post('connect')
  async connectToGame(@Req() req: Request, @Body() body: { gameId?: number }) {
    if (!body.gameId) {
      throw new HttpException('no gameId provided', HttpStatus.NOT_FOUND);
    }

    await this.gameService.connectUserToGame(req.user.id, body.gameId);
    await broadcastGameState(body.gameId);
    await broadcastGamesList();

    return 'success';
  }

  // hacky way to execute queries in serial
  updateConfirmationsQueue = new PQueue({ concurrency: 1 });

  @UseGuards(GameGuard)
  @Post('continue')
  async continueGame(@Req() req: Request, @Body() { gameId }: { gameId?: number }) {
    await this.updateConfirmationsQueue.add(async () => {
      const currGame = await Game.findOne({ where: { id: gameId } });
      console.log('currGame.waitConfirmations.length', currGame.waitConfirmations.length);
      if (currGame.waitConfirmations.length > 0) {
        currGame.waitConfirmations = without([req.user.id], currGame.waitConfirmations);
        await currGame.save();
        if (currGame.waitConfirmations.length === 0) {
          await continueGame(gameId);
        }
      }
      await broadcastGameState(gameId);
    });
  }
}
