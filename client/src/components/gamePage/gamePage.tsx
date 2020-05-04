import React, { Component } from 'react';
import { gamesService } from 'services/games.service';
import { getGameIdByLocation } from 'store/selectors/games';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { GameItem } from 'model/GameItem';
import styled from 'styled-components';
import { history } from 'router/router';
import { mainRoute } from 'router/routerPaths';
import { cardImage } from 'model/Card';
import { Button } from 'ui-elements/button';
import { Link } from 'react-router-dom';

export interface GamePageProps {
  gameId: string;
}

export interface GamePageState {
  game: GameItem | null;
}

export class GamePageComponent extends Component<GamePageProps, GamePageState> {
  state: GamePageState = { game: null };

  componentDidMount() {
    const gameId = parseInt(this.props.gameId)

    gamesService.connectToGame(gameId)
      .catch(error => {
        alert(error)
        history.replace(mainRoute)
      })
      .then((game: GameItem) => {
        this.setState({ game })
      })
  }

  render(): React.ReactElement {
    const game = this.state.game

    return (
      <div>
        {game !== null && <div>
            <GamePageTitle><ToMain to={mainRoute}>← назад</ToMain> Game by: {game.owner.login}</GamePageTitle>
            <Container>
                <Title>Игроки:</Title>
                <PlayersList>
                  {game.players.map(({ id, login }) => <PlayersListItem data-id={id}>
                    <PlayerAvatar src={'https://cdn.iconscout.com/icon/free/png-512/avatar-380-456332.png'}/>
                    <PlayerName>{login}</PlayerName>
                  </PlayersListItem>)}
                </PlayersList>
            </Container>
            <Container>
                <Title>Карты на столе:</Title>
                <CardsList>
                  <CardSlot><Card src={cardImage('10', 'H')}/></CardSlot>
                  <CardSlot><Card src={cardImage('A', 'D')}/></CardSlot>
                  <CardSlot><Card src={cardImage('K', 'S')}/></CardSlot>
                  <CardSlot><Card src={cardImage('7', 'C')}/></CardSlot>
                </CardsList>
            </Container>
            <Container>
                <Title>Мои карты:</Title>
                <CardsList>
                    <CardSlot><Card src={cardImage('7', 'C')}/></CardSlot>
                    <CardSlot><Card src={cardImage('7', 'C')}/></CardSlot>
                    <CardSlot><Card src={cardImage('7', 'C')}/></CardSlot>
                    <CardSlot><Card src={cardImage('7', 'C')}/></CardSlot>
                </CardsList>
            </Container>
        </div>}
      </div>
    );
  }
}

export const GamePage = connect(
  createSelector(getGameIdByLocation, gameId => ({ gameId })),
  () => ({})
)(GamePageComponent);

const GamePageTitle = styled.h1`
  text-align: center;
  color: rgba(26,90,188,0.83);
`;

const Title = styled.h3`
  text-align: center;
  margin: 15px 0 0 0;
`;

const Container = styled.div`
  text-align: center;
`;

const PlayersList = styled.ul`
  text-align: center;
`;

const PlayerAvatar = styled.img`
  width: 50px;
  height: 50px;
`;

const PlayerName = styled.p`
  text-align: center;
`;

const PlayersListItem = styled.li`
  display: inline-block;
  border: 1px solid #000;
  padding: 10px;
  width: 100px;
  height: 100px;
  margin: 10px;
`;

const CardsList = styled.ul`
  text-align: center;
  margin: 0;
  padding: 0;
`;

const CardSlot = styled.li`
  text-align: center;
  display: inline-block;
  border: 1px solid #000;
  padding: 10px;
  width: 100px;
  height: 130px;
  margin: 10px;
  background: #f3f3f3;
`;

const Card = styled.img`
  width: 90px;
`;

export const ToMain = styled(Link)`
    display: inline-block;
    background-color: rgba(26, 90, 188, 0.83);
    color: #fff;
    padding: 5px 10px;
    font-size: 16px;
    text-decoration: none;
    border-radius: 3px;
    vertical-align: top;
    margin-top: 4px;
`;
