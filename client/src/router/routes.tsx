import React from 'react';
import { Route, Switch } from 'react-router';
import {authorizationRoute, mainRoute, registrationRoute} from './routerPaths';
import {Authorization} from 'components/containers/authorization/authorization';
import {MainPageComponent} from 'components/containers/mainPage/mainPage';

export const Routes = (): JSX.Element => (
    <Switch>
        <Route exact path={mainRoute} component={MainPageComponent}/>
        <Route exact path={authorizationRoute} render={() => <Authorization isRegistration={false}/>}/>
        <Route exact path={registrationRoute} render={() => <Authorization isRegistration={true}/>}/>
    </Switch>
);