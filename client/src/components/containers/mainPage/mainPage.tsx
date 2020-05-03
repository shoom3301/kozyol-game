import React, {Component} from 'react';
import {history} from 'router/router';
import {gamesService} from 'services/games.service';

export class MainPageComponent extends Component<any, any> {
    state = {};

    componentDidMount() {
        gamesService.getList()
            .catch(error => {
                history.replace('/authorization')
            })
            .then(games => {
                console.log("Games: ", games)
            })
    }

    render(): React.ReactElement {
        return (
            <div>
                <h1>KOZYOL GAME</h1>
            </div>
        );
    }
}
