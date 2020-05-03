import React from 'react';
import { Route, Switch } from 'react-router';
import { QuotePageLoadable } from '../components/containers/quotePage/quotePage.loadable';
import { QuotesPageLoadable } from '../components/containers/quotesPage/quotesPage.loadable';
import {authorizationRoute, mainRoute, quotePageRoute, registrationRoute} from './routerPaths';
import {Authorization} from 'components/containers/authorization/authorization';

export const Routes = (): JSX.Element => (
    <Switch>
        <Route exact path={mainRoute} component={QuotesPageLoadable}/>
        <Route exact path={authorizationRoute} render={() => <Authorization isRegistration={false}/>}/>
        <Route exact path={registrationRoute} render={() => <Authorization isRegistration={true}/>}/>
        <Route exact path={quotePageRoute()} component={QuotePageLoadable}/>
    </Switch>
);