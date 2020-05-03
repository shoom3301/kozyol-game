import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  Body,
  HttpException,
  HttpStatus,
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
  getProfile() {
    return this.gameService.availableGames();
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

    return game;
  }
}
