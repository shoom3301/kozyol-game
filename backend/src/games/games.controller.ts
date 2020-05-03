import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('games')
export class GamesController {
  @UseGuards(JwtAuthGuard)
  @Get('list')
  getProfile(@Req() req: Request) {
    if (req.user) {
      return ['game1', 'game2'];
    }
  }
}
