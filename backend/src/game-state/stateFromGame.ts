import { Game } from 'src/games/entities/game';
import { GameState, GameStateEnum } from './types';
import { Cards } from 'src/games/cards/types';
import { map, head, toPairs, unnest, sum, fromPairs } from 'ramda';
import { hideLosersCards } from 'src/games/cards/utils';

export const getWaitState = (game: Game, userId: number): GameState => ({
  id: game.id,
  me: userId,
  owner: {
    id: game.owner.id,
    name: game.owner.login,
  },
  slotsCount: game.slotsCount,
  state: GameStateEnum.WAIT_PLAYERS,
  trump: -1,
  myScore: 0,
  gameScore: game.gameScore(),
  cardsOnTable: game.players.map(player => ({
    [player.id]: [],
  })),
  players: game.players.map(player => ({ id: player.id, name: player.login, order: 0 })),
  myCards: [],
});

export const getEndedState = (game: Game, userId: number): GameState => {
  return {
    id: game.id,
    me: userId,
    owner: {
      id: game.owner.id,
      name: game.owner.login,
    },
    slotsCount: game.slotsCount,
    state: GameStateEnum.ENDED,
    trump: -1,
    myScore: game.gameScore[userId],
    gameScore: game.gameScore(),
    cardsOnTable: game.players.map(player => ({
      [player.id]: [],
    })),
    players: game.players.map(player => ({ id: player.id, name: player.login, order: 0 })),
    myCards: [],
  };
};

export const getPlayState = async (game: Game, userId: number): Promise<GameState> => {
  const set = await game.lastSet();
  const round = await set?.lastRound();
  round.set = set;

  let state = GameStateEnum.PLAY;
  let setTricksPoints: { [id: number]: number } = {};
  if (set.finished) {
    state = GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_SET;
    const playersTricks: { [id: number]: Cards } = set.rounds.reduce((acc, round) => {
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
    setTricksPoints = fromPairs(scoresPairs);
  } else if (round?.isFinished()) {
    state = GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND;
  }

  return {
    id: game.id,
    me: userId,
    owner: {
      id: game.owner.id,
      name: game.owner.login,
    },
    slotsCount: game.slotsCount,
    state,
    tricks: setTricksPoints,
    trump: set.trump,
    currentPlayerId: round.currentPlayer.id,
    myScore: game.gameScore[userId],
    gameScore: game.gameScore(),
    cardsOnTable: hideLosersCards(round.desk, set.trump),
    players: game.players.map(player => ({ id: player.id, name: player.login, order: 0 })),
    myCards: round.hands[userId],
  };
};
