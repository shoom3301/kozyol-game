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

export class GamePageComponent extends Component<GamePageProps, any> {
  componentDidMount() {
    const gameId = parseInt(this.props.gameId)

    gamesService.connectToGame(gameId)
      .catch(error => {
        alert(error)
        history.replace(mainRoute)
      })
      .then(() => {
        gameStateService.fetch()
      })
  }

  render(): React.ReactElement {
    const { gameState } = this.props

    return (
      <div>
        {gameState !== null && <div>
            <GamePageTitle>
                <ToMain to={mainRoute}>← назад</ToMain>
                Game by: "TODO"
            </GamePageTitle>
            <PlayersList players={gameState.gameState.players}/>
          {gameState.isWaitingPlayers && <PlayersWaiting>{`Ожидаем игроков: ${gameState.slotsState}`}</PlayersWaiting>}
          {gameState.isPlaying && <CardsOnTable/>}
          {gameState.gameState.myCards.length > 0 && <MyCards
              gameId={gameState.gameState.id}
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
