import { Cards } from 'src/games/cards/types';

export enum GameStateEnum {
  WAIT_PLAYERS = 'WAIT_PLAYERS',
  PLAY = 'PLAY',
  ENDED = 'ENDED',
}

export type GameState = {
  id: number;
  state: GameStateEnum;
  trump: string;
  currentPlayerId?: number;
  // stepEndTime: string;
  myScore: number;
  gameScore: {
    [playerId: number]: number;
  };
  cardsOnTable: {
    [playerId: number]: Array<Cards | null>; // || null // null - если не побил
  };
  players: {
    id: number;
    name: string;
    order: number;
  }[];
  myCards: Cards;
};
