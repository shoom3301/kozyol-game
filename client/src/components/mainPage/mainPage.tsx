import React, {Component} from 'react';
import {GamesList} from 'components/gamesList/gamesList';
import {Game} from 'model/Game';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {getGamesList} from 'store/selectors/games';
import {gameCreate, gameFetchAll} from 'store/actions/games';
import {GameBlank} from 'model/GameBlank';

export interface MainPageProps {
    games: Game[];
    fetchAll(): void;
    createGame(game: GameBlank): void;
}

export class MainPageComponent extends Component<MainPageProps, any> {
    componentDidMount() {
        this.props.fetchAll();
    }

    render(): React.ReactElement {
        return (
            <div>
                <h1>KOZYOL GAME</h1>
                {this.props.games.length > 0 && <GamesList games={this.props.games}/>}
            </div>
        );
    }
}

export const MainPage = connect(
    createSelector(getGamesList, games => ({games})),
    dispatch => ({
        fetchAll: () => dispatch(gameFetchAll()),
        createGame: (game: GameBlank) => dispatch(gameCreate(game))
    })
)(MainPageComponent);
