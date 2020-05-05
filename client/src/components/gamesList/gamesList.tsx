import React, { Component } from "react";
import { GameItem } from "model/GameItem";
import { history } from "router/router";
import { gameRoute } from "router/routerPaths";
import { Box, FormContainer, Title } from 'ui-elements/form';
import styled from 'styled-components';

export interface GamesListProps {
  games: GameItem[];
}

export class GamesList extends Component<GamesListProps, any> {
  openGame(gameId: number) {
    history.push(gameRoute(gameId.toString()))
  }

  render(): React.ReactElement {
    return (
      <FormContainer>
        <Box>
          <Title>Список игр</Title>
        </Box>
        <GameListContainer>
          {this.props.games.length === 0 && 'Игор нет'}
          {this.props.games.map(({ id, owner, slotsCount, players }) => (
            <GameListItem key={id} onClick={() => this.openGame(id)}>
              <GameAuthor>{owner.login}:</GameAuthor>
              <GameSlots>{players.length}/{slotsCount}</GameSlots>
            </GameListItem>
          ))}
        </GameListContainer>
      </FormContainer>
    );
  }
}

export const GameListItem = styled.li`
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #e1e1e1;
    color: #000;
    display: block;
    text-decoration: none;
    background: #fff;
    cursor: pointer;
`;

export const GameAuthor = styled.span`
    margin-bottom: 5px;
    margin-right: 5px;
    font-size: 16px;
    font-weight: bold;
`;

export const GameSlots = styled.span`
    font-size: 14px;
`;

export const GameListContainer = styled.ul`
    margin: 0;
    padding: 0;
    max-height: 400px;
    overflow-y: scroll;
`;
