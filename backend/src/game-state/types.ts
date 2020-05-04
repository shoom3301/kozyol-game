import { Cards, Desk } from 'src/games/cards/types';

export enum GameStateEnum {
  WAIT_PLAYERS = 'WAIT_PLAYERS',
  PLAY = 'PLAY',
  ENDED = 'ENDED',
}

export type GameState = {
  id: number;
  state: GameStateEnum;
  trump: number;
  currentPlayerId?: number;
  // stepEndTime: string;
  myScore: number;
  gameScore: {
    [playerId: number]: number;
  };
  cardsOnTable: Desk;
  players: {
    id: number;
    name: string;
    order: number;
  }[];
  myCards: Cards;
};
