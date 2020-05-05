import React, { Component } from 'react';
import { Title } from 'ui-elements/form';
import { Container } from './elements';
import styled, { css } from 'styled-components';
import { Player } from 'model/Player';

export interface CardsOnTableProps {
  players: Player[]
  me: number
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
              key={id}>
            <PlayerAvatar src={'https://cdn.iconscout.com/icon/free/png-512/avatar-380-456332.png'}/>
            <PlayerName>{name}: {this.props.score[id]}</PlayerName>
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
`;

export const PlayersListItem = styled.li<{isMe?: boolean}>`
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
`;
