import { Game } from '../games/entities/game';
import { Cards } from '../games/cards/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Round } from 'src/games/entities/round';

export const processStep = async (game: Game, cards: Cards, userId: number) => {
  const set = await game.playingSet();
  const round = set.currentRound();

  // first step
  if (round.isDeskEmpty) {
    // TODO: check that step is allowed // zalupa-mode
    let isValSame = false;
    let isSuitSame = false;
    cards.reduce((prevCard, card) => {
      isValSame = prevCard[1] === card[1];
      isSuitSame = prevCard[0] === card[0];
      return card;
    }, cards[0]);
    if (!isValSame && !isSuitSame) {
      throw new HttpException(
        'This cards now allowed for first step',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    round.pushToDesk(cards, userId);

    await Round.save(round);
  }
};
