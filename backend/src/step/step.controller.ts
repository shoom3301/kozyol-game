import { Controller, UseGuards, Post, Req, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { Cards } from 'src/games/cards/types';
import { GamesService } from 'src/games/games.service';

@UseGuards(JwtAuthGuard)
@Controller('step')
export class StepController {
  constructor(private gameService: GamesService) {}

  @Post(':gameId')
  async doStep(
    @Req() req: Request,
    @Param('gameId') gameId: number,
    @Body() { cards }: { cards: Cards },
  ) {
    const { userId } = req.user;
    const game = await this.gameService.gameById(gameId);

    return { status: 'ok' };
  }
}
