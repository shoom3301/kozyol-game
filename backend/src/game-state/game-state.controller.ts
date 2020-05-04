import { Controller, Get, Param, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { Request } from 'express';
import { Game } from 'src/games/entities/game';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GameState } from './types';
import { getWaitState, getEndedState } from './stateFromGame';

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

    return this.calcGameState(game);
  }

  calcGameState = (game: Game): GameState => {
    if (!game.sets || game.sets.length === 0) {
      return getWaitState(game);
    }

    if (game.isFinished()) {
      return getEndedState(game);
    }
  };
}
