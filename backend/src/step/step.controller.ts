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
import { Cards } from '../games/cards/types';
import { GamesService } from 'src/games/games.service';
import { processStep } from './processStep';
import { head, values } from 'ramda';
import { GameGuard } from 'src/games/games.guard';
import { broadcastGameState } from 'src/subscribe/subscribe.controller';
import { SchedulerRegistry } from '@nestjs/schedule';

@UseGuards(JwtAuthGuard, GameGuard)
@Controller('api/step')
export class StepController {
  constructor(private gameService: GamesService, private schedulerRegistry: SchedulerRegistry) {}

  @Post(':gameId')
  async doStep(
    @Req() req: Request,
    @Param('gameId') gameId: number,
    @Body() { cards }: { cards: Cards },
  ) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      throw new HttpException('ooops', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const { id: userId } = req.user;
    const game = await this.gameService.gameById(gameId);

    // check that game is not finished
    if (game.isFinished()) {
      throw new HttpException('game over', HttpStatus.FORBIDDEN);
    }

    const set = await game.playingSet();
    const round = await set.currentRound();

    if (!round.isDeskEmpty) {
      const cardsOnDeskNum = head(values(round.desk[0])).length;
      if (cards.length !== cardsOnDeskNum) {
        throw new HttpException('cards count not equal', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

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

    await processStep(game, cards, userId, this.schedulerRegistry);
    await broadcastGameState(game.id);

    return 'success';
  }
}
