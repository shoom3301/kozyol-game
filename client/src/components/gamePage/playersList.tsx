import React, { Component } from 'react';
import { Title } from 'ui-elements/form';
import { Container } from './elements';
import styled, { css } from 'styled-components';
import { Player } from 'model/Player';

export interface CardsOnTableProps {
  players: Player[]
  me: number
  currentPlayerId?: number
  score: {
    [playerId: number]: number
  }
}

export class PlayersList extends Component<CardsOnTableProps, any> {
  render(): React.ReactElement {
    return (
      <Container>
        <Title>Игроки:</Title>
        <PlayersListContainer>
          {this.props.players
            .map(({ id, name }) => <PlayersListItem
              isMe={this.props.me === id}
              current={this.props.currentPlayerId === id}
              myTurn={this.props.currentPlayerId === id && this.props.me === id}
              key={id}>
            <PlayerAvatar src={'https://cdn.iconscout.com/icon/free/png-512/avatar-380-456332.png'}/>
              <PlayerName>{name}</PlayerName>
              <ScoreContainer><PlayerScore>{this.props.score[id]}</PlayerScore></ScoreContainer>
          </PlayersListItem>)}
        </PlayersListContainer>
      </Container>
    )
  }
}

export const PlayersListContainer = styled.ul`
  text-align: center;
`;

export const PlayerAvatar = styled.img`
  width: 50px;
  height: 50px;
`;

export const PlayerName = styled.p`
  text-align: center;
  overflow: hidden;
  margin: 0;
`;

export const ScoreContainer = styled.p`
  margin: 0;
`;

export const PlayerScore = styled.span`
  display: inline-block;
  width: 25px;
  padding: 5px 1px;
  font-size: 13px;
  border-radius: 50%;
  background: rgba(255,193,35,0.83);
  border: 2px solid #fff;
  color: #000;
  text-align: center;
`;

export const PlayersListItem = styled.li<{isMe?: boolean, current?: boolean, myTurn?: boolean}>`
  display: inline-block;
  border: 1px solid #000;
  padding: 10px;
  width: 100px;
  height: 100px;
  margin: 10px;
  
  ${({isMe}) => isMe && css`
    background: rgba(26, 90, 188, 0.83);
    color: #fff;
  `}

  ${({current}) => current && css`
    border: 3px solid rgba(255,193,35,0.83);
  `}

  ${({myTurn}) => myTurn && css`
    background: #ff5320;
  `}
`;
