import React, { Component } from 'react'
import { gamesService } from 'services/games.service'
import { getGameIdByLocation } from 'store/selectors/games'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { history } from 'router/router'
import { mainRoute } from 'router/routerPaths'
import { CardsOnTable } from 'components/gamePage/cardsOnTable'
import { MyCards } from 'components/gamePage/myCards'
import { GamePageTitle, PlayersWaiting, ToMain, } from 'components/gamePage/elements'
import { PlayersList } from 'components/gamePage/playersList'
import { gameStateService } from 'services/gameState.service'
import { GameStateHelpers } from 'helpers/gameStateHelpers'
import { getGameStateHelper } from 'store/selectors/gameState'
import { SetResults } from 'components/gamePage/setResults'
import styled from 'styled-components'

export interface GamePageProps {
  gameId: string
  gameState: GameStateHelpers | null
}

export interface GamePageState {
  timer: number | null
}

export class GamePageComponent extends Component<GamePageProps, GamePageState> {
  state: GamePageState = { timer: null }

  componentDidMount() {
    const gameId = parseInt(this.props.gameId)

    gamesService
      .connectToGame(gameId)
      .catch((error) => {
        alert(error)
        history.replace(mainRoute)
      })
      .then(() => {
        gameStateService.fetch()

        const timer = window.setInterval(() => {
          gameStateService.fetch()
        }, 3000)

        this.setState({ timer })
      })
  }

  componentWillUnmount() {
    if (this.state.timer !== null) window.clearInterval(this.state.timer)
  }

  render(): React.ReactElement {
    const { gameState } = this.props

    return (
      <div>
        {gameState !== null && (
          <div>
            <GamePageTitle>
              <ToMain to={mainRoute}>← назад</ToMain>
              Game by: {gameState.gameState.owner.name}
            </GamePageTitle>
            <PlayersList
              players={gameState.gameState.players}
              me={gameState.gameState.me}
              myTricks={gameState.gameState.myTricks}
              currentPlayerId={gameState.gameState.currentPlayerId}
              score={gameState.gameState.gameScore}
            />
            {gameState.isEnded && <EndBanner>
                <p>Игры кончились, готовь туза</p>
                <ToMain to={mainRoute}>К списку игр</ToMain>
            </EndBanner>}
            {gameState.isWaitingPlayers && (
              <PlayersWaiting>{`Ожидаем игроков: ${gameState.slotsState}`}</PlayersWaiting>
            )}
            {gameState.isPlaying && !gameState.isSetEnded && (
              <CardsOnTable
                cardsInDeck={gameState.gameState.cardsInDeck}
                trump={gameState.gameState.trump}
                cards={gameState.gameState.cardsOnTable}
              />
            )}
            {gameState.isSetEnded && !!gameState.gameState.tricks && <SetResults
                players={gameState.gameState.players}
                tricks={gameState.gameState.tricks}
            />}
            {(gameState.isPlaying) && <MyCards/>}
          </div>
        )}
      </div>
    )
  }
}

export const GamePage = connect(
  createSelector(getGameStateHelper, getGameIdByLocation, (gameState, gameId) => ({
    gameState,
    gameId,
  })),
  () => ({})
)(GamePageComponent)

export const EndBanner = styled.h2`
  text-align: center;
`