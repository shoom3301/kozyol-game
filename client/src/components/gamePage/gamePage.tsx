import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getGameIdByLocation} from 'store/selectors/games';
import {gameFetchOne} from 'store/actions/games';
import {createSelector} from 'reselect';

export interface GameProps {
    gameId: string;
    fetchGame(gameId: string): void;
}

export class GamePageComponent extends Component<GameProps, any> {
    componentDidMount() {
        if (this.props.gameId === null) {
            return;
        }

        this.props.fetchGame(this.props.gameId);
    }

    render(): React.ReactElement {
        return (
            <div>
                GAME {this.props.gameId}
            </div>
        );
    }
}

export const GamePage = connect(
    createSelector(getGameIdByLocation, gameId => ({gameId})),
    dispatch => ({
        fetchGame: (gameId: string) => dispatch(gameFetchOne(gameId))
    })
)(GamePageComponent);
