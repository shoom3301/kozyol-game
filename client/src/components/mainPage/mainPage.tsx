import React, { Component } from 'react';
import { GamesList } from 'components/gamesList/gamesList';
import { GameCreation } from 'components/gameCreation/gameCreation';
import styled from 'styled-components';
import { gamesService } from 'services/games.service';
import { history } from 'router/router';
import { authorizationRoute } from 'router/routerPaths';

export class MainPage extends Component<any, any> {

  componentDidMount() {
    gamesService.updateList()
      .catch(() => {
        history.replace(authorizationRoute)
      })
      .then(() => {
        const timer = window.setInterval(() => {
          gamesService.updateList()
        }, 3000)

        this.setState({ timer })
      })
  }

  componentWillUnmount() {
    if (this.state.timer !== null) window.clearInterval(this.state.timer)
  }

  render(): React.ReactElement {
    return (
      <div>
        <MainPageTitle>KOZYOL GAME</MainPageTitle>
        <MainPageContainer>
          <GamesList/>
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
