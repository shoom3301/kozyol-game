import { Game } from 'src/games/entities/game';
import { GameState, GameStateEnum } from './types';
import { hideLosersCards } from 'src/games/cards/utils';
import { calcPlayersTricks, calcPlayerTricksAmount } from './utils';

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
  myTricks: {
    points: 0,
    amount: 0,
  },
  cardsInDeck: 0,
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
    myTricks: {
      points: 0,
      amount: 0,
    },
    cardsInDeck: 0,
  };
};

export const getPlayState = async (game: Game, userId: number): Promise<GameState> => {
  const set = await game.lastSet();
  const round = await set?.lastRound();
  round.set = set;

  let state = GameStateEnum.PLAY;
  if (set.finished) {
    state = GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_SET;
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
    tricks: set.finished ? calcPlayersTricks(set) : {},
    trump: set.trump,
    currentPlayerId: round.currentPlayer.id,
    myScore: game.gameScore[userId],
    gameScore: game.gameScore(),
    cardsOnTable: hideLosersCards(round.desk, set.trump),
    players: game.players.map(player => ({ id: player.id, name: player.login, order: 0 })),
    myCards: round.hands[userId],
    myTricks: {
      points: calcPlayersTricks(set)[userId],
      amount: calcPlayerTricksAmount(set, userId),
    },
    cardsInDeck: set.deck.length,
  };
};
