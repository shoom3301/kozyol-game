import { Cards, Desk } from "./Card";
import { Player } from "model/Player";

export enum GameStateEnum {
  WAIT_PLAYERS = "WAIT_PLAYERS",
  WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND = "WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND",
  WAIT_CONFIRMATIONS_FOR_START_NEW_SET = "WAIT_CONFIRMATIONS_FOR_START_NEW_SET",
  PLAY = "PLAY",
  ENDED = "ENDED",
}

export type GameState = {
  id: number;
  me: number;
  owner: Player;
  slotsCount: number;
  state: GameStateEnum;
  trump: number;
  currentPlayerId?: number;
  // stepEndTime: string;
  myScore: number;
  gameScore: {
    [playerId: number]: number;
  };
  tricks?: {
    [playerId: number]: number;
  };
  cardsOnTable: Desk;
  players: Player[];
  myCards: Cards;
};
