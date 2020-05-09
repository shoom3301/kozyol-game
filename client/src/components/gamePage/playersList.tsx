import React, { Component } from 'react'
import { Title } from 'ui-elements/form'
import { Container } from './elements'
import { Player } from 'model/Player'
import {
  PlayerAvatar,
  PlayerName,
  PlayerScore,
  PlayersListContainer,
  PlayersListItem,
  PlayerTricks,
  ScoreContainer
} from 'components/gamePage/playersListElements'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getCurrentPlayerId, getGameMe, getGamePlayers, getGameScore, getMyTricks } from 'store/selectors/gameState'
import { Tricks } from 'model/GameState'

export interface CardsOnTableProps {
  players: Player[]
  me: number
  currentPlayerId?: number
  score: Tricks
  myTricks: number[]
}

export class PlayersListComponent extends Component<CardsOnTableProps, any> {
  render(): React.ReactElement {
    const { players, currentPlayerId, me, score, myTricks } = this.props

    return (
      <Container>
        <Title>Игроки:</Title>
        <PlayersListContainer>
          {players.map(({ id, name }) =>
            <PlayersListItem
              isMe={me === id}
              current={currentPlayerId === id}
              myTurn={currentPlayerId === id && me === id}
              key={id + name}>
              <PlayerTricks>{JSON.stringify(myTricks)}</PlayerTricks>
              <PlayerAvatar src={'https://cdn.iconscout.com/icon/free/png-512/avatar-380-456332.png'}/>
              <PlayerName>{name}</PlayerName>
              <ScoreContainer><PlayerScore>{score[id]}</PlayerScore></ScoreContainer>
            </PlayersListItem>
          )}
        </PlayersListContainer>
      </Container>
    )
  }
}

export const PlayersList = connect(
  createSelector(
    getGamePlayers,
    getGameMe,
    getCurrentPlayerId,
    getGameScore,
    getMyTricks,
    (players, me, currentPlayerId, score, myTricks) => ({
      players, me, currentPlayerId, score, myTricks
    })
  ),
  () => ({})
)(PlayersListComponent)
