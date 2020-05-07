// [{"2": [[2, 110], [1, 110]]}, {"3": [[2, 111], [3, 9]]}]

import { isCardsGreater } from './comparisons';
import { Suit, Rank } from './types';
import { clubs, diamonds, spades } from './make';
import { sortWithTrump } from './utils';

describe('cards comparisons stuff', () => {
  it('detect that cards greater than other ones', () => {
    expect(
      isCardsGreater(Suit.Spades)(
        [diamonds(Rank.Ten), clubs(Rank.Ten)],
        [clubs(Rank.Ace), spades(Rank.Nine)],
      ),
    ).toEqual(true);
  });

  it('sort with trump', () => {
    expect(sortWithTrump(Suit.Spades)([spades(Rank.Nine), clubs(Rank.Ace)])).toEqual([
      clubs(Rank.Ace),
      spades(Rank.Nine),
    ]);

    expect(sortWithTrump(Suit.Spades)([clubs(Rank.Ten), diamonds(Rank.Ten)])).toEqual([
      diamonds(Rank.Ten),
      clubs(Rank.Ten),
    ]);
  });
});
