import React from 'react'
import { Route, Switch } from 'react-router'
import { authorizationRoute, gameRoute, mainRoute, registrationRoute } from './routerPaths'
import { Authorization } from 'components/authorization/authorization'
import { MainPage } from 'components/mainPage/mainPage'
import { GamePage } from 'components/gamePage/gamePage'

export const Routes = (): JSX.Element => (
  <Switch>
    <Route exact path={mainRoute} component={MainPage}/>
    <Route exact path={gameRoute()} component={GamePage}/>
    <Route exact path={authorizationRoute} render={() => <Authorization isRegistration={false}/>}/>
    <Route exact path={registrationRoute} render={() => <Authorization isRegistration={true}/>}/>
  </Switch>
)