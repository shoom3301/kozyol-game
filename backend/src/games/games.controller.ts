import { Controller, Get, Req, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

import { GamesService } from './games.service';
import { UserService } from '../user/user.service';

@Controller('games')
export class GamesController {
  constructor(private gameService: GamesService, private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  getProfile() {
    return this.gameService.availableGames();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createGame(@Req() req: Request) {
    console.log(req.user);
    const game = await this.gameService.create({
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      owner: { id: req.user.userId },
      slotsCount: req.body.slotsCount,
    });
    return game;
  }
}
