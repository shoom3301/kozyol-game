import { IState } from 'store/states'
import { createSelector } from 'reselect'
import { GameStages, GameState, GameStateEnum } from 'model/GameState'

export const getGameState = ({ gameState }: IState): GameState => gameState
export const getGameId = createSelector(getGameState, ({ id }) => id)
export const getMyCards = createSelector(getGameState, ({ myCards }) => myCards)
export const getTrump = createSelector(getGameState, ({ trump }) => trump)
export const getCardsInDeck = createSelector(getGameState, ({ cardsInDeck }) => cardsInDeck)
export const getCardsOnTable = createSelector(getGameState, ({ cardsOnTable }) => cardsOnTable)
export const getGameStage = createSelector(getGameState, ({ state }) => state)
export const getGameOwnerName = createSelector(getGameState, ({ owner }) => owner.name)
export const getGamePlayers = createSelector(getGameState, ({ players }) => players)
export const getGameSlotsCount = createSelector(getGameState, ({ slotsCount }) => slotsCount)
export const getGameMe = createSelector(getGameState, ({ me }) => me)
export const getMyTricks = createSelector(getGameState, ({ myTricks }) => myTricks)
export const getGameTricks = createSelector(getGameState, ({ tricks }) => tricks)
export const getCurrentPlayerId = createSelector(
  getGameState,
  ({ currentPlayerId }) => currentPlayerId,
)
export const getGameScore = createSelector(getGameState, ({ gameScore }) => gameScore)
export const getIsWaitNewSet = createSelector(
  getGameStage,
  (stage) => stage === GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_SET,
)
export const getIsGameEnded = createSelector(getGameStage, (stage) => stage === GameStateEnum.ENDED)
export const getIsWaitPlayers = createSelector(
  getGameStage,
  (stage) => stage === GameStateEnum.WAIT_PLAYERS,
)
export const getIsWaitNewRound = createSelector(
  getGameStage,
  (stage) => stage === GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND,
)
export const getIsWaitConfirm = createSelector(
  getIsWaitNewSet,
  getIsWaitNewRound,
  (waitingNewSet, waitingNewRound) => waitingNewSet || waitingNewRound,
)
export const getIsPlaying = createSelector(getGameStage, (stage) =>
  [
    GameStateEnum.PLAY,
    GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND,
    GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_SET,
  ].includes(stage),
)
export const getGameStages = createSelector(
  getIsWaitNewSet,
  getIsGameEnded,
  getIsWaitPlayers,
  getIsWaitNewRound,
  getIsWaitConfirm,
  getIsPlaying,
  (
    isWaitNewSet,
    isGameEnded,
    isWaitPlayers,
    isWaitNewRound,
    isWaitConfirm,
    isPlaying,
  ): GameStages => ({
    isWaitNewSet,
    isGameEnded,
    isWaitPlayers,
    isWaitNewRound,
    isWaitConfirm,
    isPlaying,
  }),
)
export const getGameSlotsState = createSelector(
  getGamePlayers,
  getGameSlotsCount,
  (players, slotsCount) => `${players.length}/${slotsCount}`,
)
export const getIsMyTurn = createSelector(
  getGameMe,
  getCurrentPlayerId,
  getIsWaitConfirm,
  (me, currentPlayerId, isWaitingConfirmations) =>
    me === currentPlayerId && !isWaitingConfirmations,
)
