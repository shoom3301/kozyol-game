import React, {Component} from 'react';
import {authService} from 'services/auth.service';
import {history} from 'router/router';

export class MainPageComponent extends Component<any, any> {
    state = {};

    componentDidMount() {
        authService.isAuthorized()
            .then(isAuthorized => {
                if (!isAuthorized) {
                    history.replace('/authorization')
                }
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
