import React, { Component } from 'react';
import { Title } from 'ui-elements/form';
import { Container } from './elements';
import styled from 'styled-components';
import { Player } from 'model/Player';

export interface CardsOnTableProps {
  players: Player[]
}

export class PlayersList extends Component<CardsOnTableProps, any> {
  render(): React.ReactElement {
    return (
      <Container>
        <Title>Игроки:</Title>
        <PlayersListContainer>
          {this.props.players
            .sort((a, b) => a.order - b.order)
            .map(({ id, name, order }) => <PlayersListItem key={id}>
            <PlayerAvatar src={'https://cdn.iconscout.com/icon/free/png-512/avatar-380-456332.png'}/>
            <PlayerName>{name} ({order})</PlayerName>
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

export const PlayersListItem = styled.li`
  display: inline-block;
  border: 1px solid #000;
  padding: 10px;
  width: 100px;
  height: 100px;
  margin: 10px;
`;
