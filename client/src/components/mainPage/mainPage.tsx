import React, { Component } from 'react';
import { GamesList } from 'components/gamesList/gamesList';
import { GameCreation } from 'components/gameCreation/gameCreation';
import styled from 'styled-components';
import { GameItem } from 'model/GameItem';
import { gamesService } from 'services/games.service';
import { store } from 'store';
import { getGamesList } from 'store/selectors/games';
import { history } from 'router/router';
import { authorizationRoute } from 'router/routerPaths';

export interface MainPageState {
  games: GameItem[]
}

export class MainPage extends Component<any, MainPageState> {
  state = { games: [] }

  componentDidMount() {
    gamesService
      .updateList()
      .catch(() => {
        history.replace(authorizationRoute)
      })

    store.subscribe(() => {
      this.setState({ games: getGamesList() })
    })
  }

  render(): React.ReactElement {
    return (
      <div>
        <MainPageTitle>KOZYOL GAME</MainPageTitle>
        <MainPageContainer>
          <GamesList games={this.state.games}/>
          <GameCreation/>
        </MainPageContainer>
      </div>
    );
  }
}

const MainPageContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 0 5%;
`;

const MainPageTitle = styled.h1`
  text-align: center;
  color: rgba(26,90,188,0.83);
`;
