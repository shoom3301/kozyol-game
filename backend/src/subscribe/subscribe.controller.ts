import { Controller, UseGuards, Param, Get, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { GameGuard } from 'src/games/games.guard';

@UseGuards(JwtAuthGuard, GameGuard)
@Controller('subscribe')
export class SubscribeController {
  @Get(':gameId')
  async subscribeToUpdates(@Res() res: Response, @Param('gameId') gameId: number) {
    res.write('ok');
  }
}
