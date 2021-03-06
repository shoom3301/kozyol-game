import React, { Component } from 'react'
import { GameItem } from 'model/GameItem'
import { history } from 'router/router'
import { authorizationRoute, gameRoute } from 'router/routerPaths'
import { Box, FormContainer, Title } from 'ui-elements/form'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getGamesList } from 'store/selectors/games'
import { GameAuthor, GameListContainer, GameListItem, GameSlots } from 'components/gamesList/gamesListElements'
import { sseService } from 'services/sse.service'
import { authService } from 'services/auth.service'

export interface GamesListProps {
  games: GameItem[]
}

export class GamesListComponent extends Component<GamesListProps, any> {
  componentDidMount() {
    authService.ping()
      .then(() => {
        sseService.subscribeToGamesList()
      })
      .catch(() => {
        history.replace(authorizationRoute)
      })
  }

  componentWillUnmount() {
    sseService.unsubscribeFromGamesList()
  }

  openGame(gameId: number) {
    history.push(gameRoute(gameId.toString()))
  }

  render(): React.ReactElement {
    const { games } = this.props

    return (
      <FormContainer>
        <Box>
          <Title>Список игр</Title>
        </Box>
        <GameListContainer>
          {games.length === 0 && 'Игор нет'}
          {games.map(({ id, owner, slotsCount, players }) => (
            <GameListItem key={id} onClick={() => this.openGame(id)}>
              <GameAuthor>{owner.login}:</GameAuthor>
              <GameSlots>{players.length}/{slotsCount}</GameSlots>
            </GameListItem>
          ))}
        </GameListContainer>
      </FormContainer>
    )
  }
}

export const GamesList = connect(
  createSelector(getGamesList, games => ({ games })),
  () => ({})
)(GamesListComponent)
