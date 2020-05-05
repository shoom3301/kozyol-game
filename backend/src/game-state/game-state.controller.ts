import { Request } from 'express';
import { Controller, Get, Param, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { calcGameState } from './calcGameState';

@UseGuards(JwtAuthGuard)
@Controller('gameState')
export class GameStateController {
  constructor(private gameService: GamesService) {}

  @Get(':gameId')
  async getState(@Req() req: Request, @Param('gameId') gameId: number) {
    const game = await this.gameService.gameById(gameId);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!game.hasPlayer(req.user!.userId)) {
      throw new HttpException('you are not connected to game', HttpStatus.FORBIDDEN);
    }

    return calcGameState(game, req.user.userId);
  }
}
