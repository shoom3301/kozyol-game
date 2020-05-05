import { Game } from 'src/games/entities/game';
import { GameState, GameStateEnum } from './types';

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

// TODO: test
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
  const set = await game.playingSet();

  if (!set) {
    return getEndedState(game, userId);
  }

  const round = await set.currentRound();

  return {
    id: game.id,
    me: userId,
    owner: {
      id: game.owner.id,
      name: game.owner.login,
    },
    slotsCount: game.slotsCount,
    state: GameStateEnum.PLAY,
    trump: set.trump,
    currentPlayerId: round.currentPlayer.id,
    myScore: game.gameScore[userId],
    gameScore: game.gameScore(),
    cardsOnTable: round.desk,
    players: game.players.map(player => ({ id: player.id, name: player.login, order: 0 })),
    myCards: round.hands[userId],
  };
};
