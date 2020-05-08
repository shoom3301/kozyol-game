import { GameSet } from 'src/games/entities/set';
import { Cards } from 'src/games/cards/types';
import { map, head, toPairs, unnest, sum, fromPairs } from 'ramda';
import { calcPointsInTrick } from 'src/games/cards/utils';

/**
 *
 * @param set set for calculate
 * @returns points for tricks
 */
export const calcPlayersTricks = (set: GameSet): { [id: number]: number } => {
  const playersTricks: { [id: number]: Cards } = set.rounds.reduce((acc, round) => {
    // prevent to calc tricks in not finished rounds
    if (!round.isFinishedWithSet(set)) {
      return acc;
    }
    const winnerId = round.winner.id;
    if (!acc[winnerId]) {
      acc[winnerId] = [];
    }

    const tricks = map(trick => head(toPairs(trick))[1], round.desk);
    acc[winnerId] = [...acc[winnerId], ...unnest(tricks)];
    return acc;
  }, {});
  const scoresPairs = map(pair => {
    const cardsSum = sum(map(card => (card[1] > 100 ? card[1] - 100 : 0), pair[1]));
    return [pair[0], cardsSum];
  }, toPairs(playersTricks));

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return fromPairs(scoresPairs);
};

/**
 *
 * @param set set for calc
 * @param userId user for calc
 * @returns amount of user tricks in set as sequence
 */
export const calcPlayerTricksArray = (set: GameSet, userId: number) => {
  return set.rounds
    .map(round => {
      if (round.isFinishedWithSet(set) && round.winner.id === userId) {
        return calcPointsInTrick(round.desk);
      } else {
        return null;
      }
    })
    .filter(item => item != null);
};
