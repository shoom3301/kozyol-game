import React, { Component } from "react";
import { Game } from "model/Game";
import { history } from "router/router";
import { gameRoute } from "router/routerPaths";

export interface GamesListProps {
  games: Game[];
}

export class GamesList extends Component<GamesListProps, any> {
  state = {};

  openGame(gameId: string) {
    history.push(gameRoute(gameId));
  }

  render(): React.ReactElement {
    return (
      <ul>
        {this.props.games.map(({ id, owner, slotsCount, playersCount }) => (
          <li key={id} onClick={() => this.openGame(id)}>
            <span>{owner.login}</span>:{" "}
            <span>
              {playersCount}/{slotsCount}
            </span>
          </li>
        ))}
      </ul>
    );
  }
}
