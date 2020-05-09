import { GameState, GameStateEnum } from 'model/GameState'

export const defaultGameStateState: GameState = {
  cardsInDeck: 0,
  cardsOnTable: [],
  gameScore: {},
  id: 0,
  me: 0,
  myCards: [],
  myScore: 0,
  myTricks: [],
  owner: { id: 0, name: '' },
  players: [],
  slotsCount: 0,
  state: GameStateEnum.WAIT_PLAYERS,
  trump: 0
}
