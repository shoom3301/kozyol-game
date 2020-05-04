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
import { Link } from 'react-router-dom';

export enum Suit {
  Hearts = 0, // – червы ♥
  Diamonds, // – бубны ♦
  Clubs, // – трефы ♣
  Spades, // – пики точеные ♠
}

export enum Value {
  Six = -6,
  Seven = -7,
  Eight = -8,
  Nine = -9,
  Jack = 2, // – валет
  Queen, // – дама
  King, // – король
  Ten = 10,
  Ace, // – туз
}

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
                  <CardSlot>
                      <Card src={cardImage(Value.Six, Suit.Hearts)}/>
                      <Card src={cardImage(Value.Eight, Suit.Hearts)}/>
                      <Card src={cardImage(Value.Ten, Suit.Hearts)}/>
                      <Card src={cardImage(Value.Ace, Suit.Hearts)}/>
                  </CardSlot>
                  <CardSlot><Card src={cardImage(Value.Ace, Suit.Diamonds)}/></CardSlot>
                  <CardSlot><Card src={cardImage(Value.King, Suit.Spades)}/></CardSlot>
                  <CardSlot><Card src={cardImage(Value.Seven, Suit.Clubs)}/></CardSlot>
                </CardsList>
            </Container>
            <Container>
                <Title>Мои карты:</Title>
                <CardsList>
                    <MyCardSlot><Card src={cardImage(Value.Seven, Suit.Clubs)}/></MyCardSlot>
                    <MyCardSlot><Card src={cardImage(Value.Seven, Suit.Clubs)}/></MyCardSlot>
                    <MyCardSlot><Card src={cardImage(Value.Seven, Suit.Clubs)}/></MyCardSlot>
                    <MyCardSlot><Card src={cardImage(Value.Seven, Suit.Clubs)}/></MyCardSlot>
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
  width: 120px;
  height: 150px;
  margin: 10px;
  background: #f3f3f3;
  overflow: hidden;
  position: relative;
`;

const MyCardSlot = styled(CardSlot)`
  cursor: pointer;

  :hover {
    background: rgba(26, 90, 188, 0.83);
  }
`;

const Card = styled.img`
  width: 90px;
  position: absolute;
  left: 10px;
  top: 10px;
  
  :nth-child(2) {
    left: 20px;
    top: 20px;
  }
  
  :nth-child(3) {
    left: 30px;
    top: 30px;
  }
  
  :nth-child(4) {
    left: 40px;
    top: 40px;
  }
  
  :nth-child(5) {
    left: 50px;
    top: 50px;
  }
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
