import React, { Component } from 'react';
import { gamesService } from 'services/games.service';
import { getGameIdByLocation } from 'store/selectors/games';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { GameItem } from 'model/GameItem';
import { history } from 'router/router';
import { mainRoute } from 'router/routerPaths';
import { CardsOnTable } from 'components/gamePage/cardsOnTable';
import { MyCards } from 'components/gamePage/myCards';
import { GamePageTitle, PlayersWaiting, ToMain } from 'components/gamePage/elements';
import { PlayersList } from 'components/gamePage/playersList';
import { gameStateService } from 'services/gameState.service';
import { GameStateHelpers } from 'helpers/gameStateHelpers';

export interface GamePageProps {
  gameId: string;
}

export interface GamePageState {
  gameState: GameStateHelpers | null;
}

export class GamePageComponent extends Component<GamePageProps, GamePageState> {
  state: GamePageState = {
    gameState: null
  };

  componentDidMount() {
    const gameId = parseInt(this.props.gameId)

    gamesService.connectToGame(gameId)
      .catch(error => {
        alert(error)
        history.replace(mainRoute)
      })
      .then((game: GameItem) => {
        gameStateService.getGameState(gameId).then(gameState => {
          this.setState({ gameState: new GameStateHelpers(game, gameState) })
        })
      })
  }

  render(): React.ReactElement {
    const { gameState } = this.state

    return (
      <div>
        {gameState !== null && <div>
          <GamePageTitle>
            <ToMain to={mainRoute}>← назад</ToMain>
            Game by: {gameState.gameItem.owner.login}
          </GamePageTitle>
          <PlayersList players={gameState.gameState.players}/>
          {gameState.isWaitingPlayers && <PlayersWaiting>{`Ожидаем игроков: ${gameState.slotsState}`}</PlayersWaiting>}
          {gameState.isPlaying && <CardsOnTable/>}
          {gameState.gameState.myCards.length > 0 && <MyCards cards={gameState.gameState.myCards}/>}
        </div>}
      </div>
    );
  }
}

export const GamePage = connect(
  createSelector(getGameIdByLocation, gameId => ({ gameId })),
  () => ({})
)(GamePageComponent);
