// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types.d.ts" />

import { Controller, Req, UseGuards, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import PQueue from 'p-queue';

import { GamesService } from './games.service';
import { GameGuard } from './games.guard';
import { broadcastGamesList, broadcastGameState } from 'src/subscribe/subscribe.controller';
import {
  confirmContinue,
  isGameNeedConfirmationsForContinue,
} from './helpers/createAwaitedConfirmation';
import { continueGame } from './helpers/continueGame';
import { SchedulerRegistry } from '@nestjs/schedule';
import { deleteTimeoutForGame } from './helpers/timeoutHelpers';

@UseGuards(JwtAuthGuard)
@Controller('api/games')
export class GamesController {
  constructor(private gameService: GamesService, private schedulerRegistry: SchedulerRegistry) {}

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
      await confirmContinue(gameId, req.user.id);

      const needMoreConfirmations = await isGameNeedConfirmationsForContinue(gameId);
      if (!needMoreConfirmations) {
        deleteTimeoutForGame(gameId, this.schedulerRegistry);

        await continueGame(gameId, this.schedulerRegistry);
        await broadcastGameState(gameId);
      }
    });
  }
}
