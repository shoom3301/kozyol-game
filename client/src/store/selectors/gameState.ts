import { IState } from 'store/states'
import { GameStateHelpers } from 'helpers/gameStateHelpers'
import { createSelector } from 'reselect'
import { GameStateEnum } from 'model/GameState'

export const getGameStateHelper = ({ gameState }: IState): GameStateHelpers => gameState
export const getGameState = createSelector(getGameStateHelper, ({ gameState }) => gameState)
export const getGameId = createSelector(getGameState, (gameState) => gameState.id)
export const getMyCards = createSelector(getGameState, (gameState) => gameState.myCards)
export const getTrump = createSelector(getGameState, (gameState) => gameState.trump)
export const getCardsInDeck = createSelector(getGameState, (gameState) => gameState.cardsInDeck)
export const getCardsOnTable = createSelector(getGameState, (gameState) => gameState.cardsOnTable)
export const getGameStage = createSelector(getGameState, (gameState) => gameState.state)
export const getIsWaitingForStartNewSet = createSelector(
  getGameStage,
  (stage) => stage === GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_SET,
)
export const getIsWaitingForStartNewRound = createSelector(
  getGameStage,
  (stage) => stage === GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND,
)
export const getIsWaitingConfirmations = createSelector(
  getIsWaitingForStartNewSet,
  getIsWaitingForStartNewRound,
  (waitingNewSet, waitingNewRound) => waitingNewSet || waitingNewRound,
)
export const getIsMyTurn = createSelector(
  getGameState,
  getIsWaitingConfirmations,
  (gameState, isWaitingConfirmations) =>
    gameState.me === gameState.currentPlayerId && !isWaitingConfirmations,
)
