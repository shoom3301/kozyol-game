import { Cards, Desk } from './Card';
import { Player } from 'model/Player';

export enum GameStateEnum {
  WAIT_PLAYERS = 'WAIT_PLAYERS',
  PLAY = 'PLAY',
  ENDED = 'ENDED',
}

export type GameState = {
  id: number;
  me: number;
  state: GameStateEnum;
  trump: number;
  currentPlayerId?: number;
  owner: Player;
  slotsCount: number;
  // stepEndTime: string;
  myScore: number;
  gameScore: {
    [playerId: number]: number;
  };
  cardsOnTable: Desk;
  players: Player[];
  myCards: Cards;
};
