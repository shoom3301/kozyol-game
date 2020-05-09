import { Controller, UseGuards, Param, Get, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('subscribe')
export class SubscribeController {
  @Get(':gameId')
  async subscribeToUpdates(@Res() res: Response, @Param('gameId') gameId: number) {
    //
  }
}
