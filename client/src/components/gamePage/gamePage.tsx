import React, { Component } from 'react';
import { gamesService } from 'services/games.service';
import { getGameIdByLocation } from 'store/selectors/games';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { history } from 'router/router';
import { mainRoute } from 'router/routerPaths';
import { CardsOnTable } from 'components/gamePage/cardsOnTable';
import { MyCards } from 'components/gamePage/myCards';
import { GamePageTitle, PlayersWaiting, ToMain } from 'components/gamePage/elements';
import { PlayersList } from 'components/gamePage/playersList';
import { gameStateService } from 'services/gameState.service';
import { GameStateHelpers } from 'helpers/gameStateHelpers';
import { getGameState } from 'store/selectors/gameState';

export interface GamePageProps {
  gameId: string;
  gameState: GameStateHelpers | null;
}

export interface GamePageState {
  timer: number | null;
}

export class GamePageComponent extends Component<GamePageProps, GamePageState> {
  state: GamePageState = { timer: null };

  componentDidMount() {
    const gameId = parseInt(this.props.gameId)

    gamesService.connectToGame(gameId)
      .catch(error => {
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
        {gameState !== null && <div>
          <GamePageTitle>
            <ToMain to={mainRoute}>← назад</ToMain>
            Game by: {gameState.gameState.owner.name}
          </GamePageTitle>
          <PlayersList
            players={gameState.gameState.players}
            me={gameState.gameState.me}
            currentPlayerId={gameState.gameState.currentPlayerId}
            score={gameState.gameState.gameScore}/>
          {gameState.isWaitingPlayers &&
          <PlayersWaiting>{`Ожидаем игроков: ${gameState.slotsState}`}</PlayersWaiting>}
          {gameState.isPlaying &&
          <CardsOnTable
            trump={gameState.gameState.trump}
            cards={gameState.gameState.cardsOnTable}/>}
          {gameState.gameState.myCards.length > 0 &&
          <MyCards
            gameId={gameState.gameState.id}
            enabled={gameState.isMyTurn}
            cardsOnTable={gameState.gameState.cardsOnTable}
            cards={gameState.gameState.myCards}/>}
        </div>}
      </div>
    );
  }
}

export const GamePage = connect(
  createSelector(getGameState, getGameIdByLocation, (gameState, gameId) => ({ gameState, gameId })),
  () => ({})
)(GamePageComponent);
