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

import { GamesService } from './games.service';
import { UserService } from '../user/user.service';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private gameService: GamesService, private userService: UserService) {}

  @Get('list')
  getGames() {
    return this.gameService.availableGames();
  }

  @Get(':gameId')
  async gameById(@Req() req: Request, @Param('gameId') gameId?: number) {
    const game = await this.gameService.gameById(gameId);
    console.log({ game });
    if (!game) {
      throw new HttpException('no game found', HttpStatus.NOT_FOUND);
    }

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
      // players: [{ id: 4 }, { id: 5 }, { id: 6 }],
    });
    return game;
  }

  @Post('connect')
  async connectToGame(@Req() req: Request, @Body() body: { gameId?: number }) {
    if (!body.gameId) {
      throw new HttpException('no gameId provided', HttpStatus.NOT_FOUND);
    }

    const game = await this.gameService.connectUserToGame(req.user.userId, body.gameId);

    return game;
  }
}
