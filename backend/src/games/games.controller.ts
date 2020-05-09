// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types.d.ts" />

import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';

import { GamesService } from './games.service';
import { UserService } from '../user/user.service';
import { calcGameState } from 'src/game-state/calcGameState';
import { continueGame } from './helpers/continueGame';
import { Game } from './entities/game';
import { without } from 'ramda';

@UseGuards(JwtAuthGuard)
@Controller('api/games')
export class GamesController {
  constructor(private gameService: GamesService, private userService: UserService) {}

  @Get('list')
  getGames() {
    return this.gameService.availableGames();
  }

  @Get(':gameId')
  async gameById(@Req() req: Request, @Param('gameId') gameId?: number) {
    const game = await this.gameService.gameById(gameId);

    if (!game.hasPlayer(req.user.userId)) {
      throw new HttpException('you are not connected to game', HttpStatus.FORBIDDEN);
    }

    return game;
  }

  @Post('create')
  async createGame(@Req() req: Request) {
    console.log(req.user);
    const game = await this.gameService.create({
      owner: { id: req.user.userId },
      slotsCount: req.body.slotsCount,
    });
    return game;
  }

  @Post('connect')
  async connectToGame(@Req() req: Request, @Body() body: { gameId?: number }) {
    if (!body.gameId) {
      throw new HttpException('no gameId provided', HttpStatus.NOT_FOUND);
    }

    const game = await this.gameService.connectUserToGame(req.user.userId, body.gameId);

    return calcGameState(game, req.user.userId);
  }

  @Post('continue')
  async continueGame(@Req() req: Request, @Body() { gameId }: { gameId?: number }) {
    const currGame = await Game.findOne({ where: { id: gameId } });
    if (currGame.waitConfirmations.length > 0) {
      currGame.waitConfirmations = without([req.user.userId], currGame.waitConfirmations);
      await currGame.save();
      if (currGame.waitConfirmations.length === 0) {
        await continueGame(gameId);
        // TODO: broadcast new state to clients
      }
      return;
    }
  }

  @Get('subscribe/:gameId')
  async subscribeToGameStateUpdates(@Param('gameId') gameId: number) {
    //
  }
}
