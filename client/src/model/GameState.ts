import { Cards, Desk } from './Card'
import { Player } from 'model/Player'

export enum GameStateEnum {
  WAIT_PLAYERS = 'WAIT_PLAYERS',
  WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND = 'WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND',
  WAIT_CONFIRMATIONS_FOR_START_NEW_SET = 'WAIT_CONFIRMATIONS_FOR_START_NEW_SET',
  PLAY = 'PLAY',
  ENDED = 'ENDED',
}

export type Tricks = {
  [playerId: number]: number
}

export type GameStages = {
  isWaitNewSet: boolean
  isGameEnded: boolean
  isWaitPlayers: boolean
  isWaitNewRound: boolean
  isWaitConfirm: boolean
  isPlaying: boolean
}

export type GameState = {
  id: number
  me: number
  myTricks: number[]
  owner: Player
  slotsCount: number
  state: GameStateEnum
  trump: number
  currentPlayerId?: number
  myScore: number
  gameScore: Tricks
  tricks?: Tricks
  cardsOnTable: Desk
  cardsInDeck: number
  players: Player[]
  myCards: Cards
}
