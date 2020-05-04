import React, { Component } from 'react';
import { GamesList } from 'components/gamesList/gamesList';
import { GameCreation } from 'components/gameCreation/gameCreation';
import styled from 'styled-components';
import { GameItem } from 'model/GameItem';
import { gamesService } from 'services/games.service';
import { getGamesList } from 'store/selectors/games';
import { history } from 'router/router';
import { authorizationRoute } from 'router/routerPaths';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

export interface MainPageProps {
  games: GameItem[]
}

export class MainPageComponent extends Component<MainPageProps, any> {

  componentDidMount() {
    gamesService.updateList()
      .catch(() => {
        history.replace(authorizationRoute)
      })
  }

  render(): React.ReactElement {
    return (
      <div>
        <MainPageTitle>KOZYOL GAME</MainPageTitle>
        <MainPageContainer>
          <GamesList games={this.props.games}/>
          <GameCreation/>
        </MainPageContainer>
      </div>
    );
  }
}

export const MainPage = connect(
  createSelector(getGamesList, games => ({ games })),
  () => ({})
)(MainPageComponent);

const MainPageContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 0 5%;
`;

const MainPageTitle = styled.h1`
  text-align: center;
  color: rgba(26,90,188,0.83);
`;
