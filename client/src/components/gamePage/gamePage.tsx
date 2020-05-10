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
import { getGameOwnerName, getGameSlotsState, getGameStages } from 'store/selectors/gameState'
import { SetResults } from 'components/gamePage/setResults'
import styled from 'styled-components'
import { GameStages } from 'model/GameState'
import { sseService } from 'services/sse.service'
import { gameStateService } from 'services/gameState.service'
import { store } from 'store'
import { gameStateUpdate } from 'store/actions/gameState'

export interface GamePageProps {
  ownerName: string
  gameStages: GameStages
  slotsState: string
  gameId: string
}

export class GamePageComponent extends Component<GamePageProps, any> {
  componentDidMount() {
    sseService.connect()

    const gameId = parseInt(this.props.gameId)

    gamesService
      .connectToGame(gameId)
      .catch((error) => {
        alert(error)
        history.replace(mainRoute)
      })
      .then(() => {
        sseService.subscribeToGame()
        gameStateService.getGameState(gameId)
          .then(state => {
            store.dispatch(gameStateUpdate(state))
          })
      })
  }

  componentWillUnmount() {
    sseService.unsubscribeFromGame()
    sseService.disconnect()
  }

  render(): React.ReactElement {
    const {
      ownerName,
      gameStages,
      slotsState
    } = this.props

    return (
      <div>
        <GamePageTitle>
          <ToMain to={mainRoute}>← назад</ToMain>
          Game by: {ownerName}
        </GamePageTitle>
        <PlayersList/>
        {gameStages.isGameEnded &&
        <EndBanner>
            <p>Game over!</p>
            <ToMain to={mainRoute}>К списку игр</ToMain>
        </EndBanner>
        }
        {gameStages.isWaitPlayers &&
        <PlayersWaiting>{`Ожидаем игроков: ${slotsState}`}</PlayersWaiting>
        }
        {gameStages.isPlaying && !gameStages.isWaitNewSet &&
        <CardsOnTable/>
        }
        {gameStages.isWaitNewSet &&
        <SetResults/>
        }
        {gameStages.isPlaying &&
        <MyCards/>
        }
      </div>
    )
  }
}

export const GamePage = connect(
  createSelector(
    getGameOwnerName,
    getGameStages,
    getGameSlotsState,
    getGameIdByLocation,
    (
      ownerName, gameStages, slotsState, gameId
    ) => ({
      ownerName, gameStages, slotsState, gameId
    })
  ),
  () => ({})
)(GamePageComponent)

export const EndBanner = styled.h2`
  text-align: center;
`
