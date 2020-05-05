import {
  Controller,
  UseGuards,
  Post,
  Req,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { Cards } from 'src/games/cards/types';
import { GamesService } from 'src/games/games.service';
import { processStep } from './processStep';

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
    console.log({ cards });

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      throw new HttpException('ooops', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const { userId } = req.user;
    const game = await this.gameService.gameById(gameId);

    // когда вырасту, напишу Guard для этой шляпы
    if (!game.hasPlayer(userId)) {
      throw new HttpException('idi v svoy dvor', HttpStatus.FORBIDDEN);
    }

    // check that game is not finished
    if (game.isFinished()) {
      throw new HttpException('game over', HttpStatus.FORBIDDEN);
    }

    const set = await game.playingSet();
    const round = await set.currentRound();

    // check that user doing step according to order
    if (round.currentPlayer.id !== userId) {
      throw new HttpException('v ochered, sukiny deti', HttpStatus.FORBIDDEN);
    }

    // check that user has posted cards
    const userCards = round.hands[userId];
    cards.forEach(postedCard => {
      if (
        !userCards.find(userCard => userCard[0] === postedCard[0] && userCard[1] === postedCard[1])
      ) {
        throw new HttpException('TY CHO, SUKA, TY CHO', HttpStatus.FORBIDDEN);
      }
    });

    await processStep(game, cards, userId);

    return { status: 'ok' };
  }
}
