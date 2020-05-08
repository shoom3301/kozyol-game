import { hideLosersCards } from './utils';
import { diamonds, hearts, spades, clubs } from './make';
import { Rank, Suit } from './types';

// trump 0
describe('utils', () => {
  describe('hide losers cards on desk', () => {
    it('when desk is full', () => {
      // [{"1": [[1, 9], [0, 9]]}, {"2": [[1, 8], [3, 102]]}, {"3": [[0, 7], [0, 110]]}] 2 - lose, 3 - win
      // trump - 0
      const desk = [
        { 1: [diamonds(Rank.Nine), hearts(Rank.Nine)] },
        { 2: [diamonds(Rank.Eight), spades(Rank.Jack)] },
        { 3: [hearts(Rank.Seven), hearts(Rank.Ten)] },
      ];
      const filteredDesk = hideLosersCards(desk, Suit.Hearts);
      expect(filteredDesk).toEqual([
        { 1: [diamonds(Rank.Nine), hearts(Rank.Nine)] },
        { 2: [null, null] },
        { 3: [hearts(Rank.Seven), hearts(Rank.Ten)] },
      ]);
    });

    it('when desk is not full', () => {
      // [{"3": [[3, 6], [3, 9]]}, {"1": [[2, 9], [2, 7]]}] 3 - win, 1 - lose, 2 - didnt turn
      // trump - 0
      const desk = [
        { 3: [spades(Rank.Six), spades(Rank.Nine)] },
        { 1: [clubs(Rank.Nine), clubs(Rank.Seven)] },
      ];
      const filteredDesk = hideLosersCards(desk, Suit.Hearts);
      expect(filteredDesk).toEqual([
        { 3: [spades(Rank.Six), spades(Rank.Nine)] },
        { 1: [null, null] },
      ]);
    });
  });
});
