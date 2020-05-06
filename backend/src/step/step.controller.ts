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
import { head, values, without } from 'ramda';
import { calcGameState } from 'src/game-state/calcGameState';
import { Game } from 'src/games/entities/game';
import { continueGame } from 'src/games/helpers/continueGame';

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
    // TODO: temp
    const currGame = await Game.findOne({ where: { id: gameId } });
    if (currGame.waitConfirmations.length > 0) {
      currGame.waitConfirmations = without([req.user.userId], currGame.waitConfirmations);
      await currGame.save();
      if (currGame.waitConfirmations.length === 0) {
        await continueGame(gameId);
      }
      return;
    }

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

    await processStep(game, cards, userId);

    await game.reload();
    return calcGameState(game, userId);
  }
}
