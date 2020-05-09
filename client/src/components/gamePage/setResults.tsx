import React, { Component } from 'react'
import { Title } from 'ui-elements/form'
import { Container } from './elements'
import { Player } from 'model/Player'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getGamePlayers, getGameTricks } from 'store/selectors/gameState'
import { Tricks } from 'model/GameState'

export interface SetResultsProps {
  tricks?: Tricks
  players: Player[]
}

export class SetResultsComponent extends Component<SetResultsProps, any> {
  render(): React.ReactElement {
    const { players, tricks } = this.props

    if (!tricks) return <span/>

    return (
      <Container>
        <Title>Итоги круга:</Title>
        <ResultsList>
          {players.map(player => {
            return <ResultsListItem key={player.id}>
              <strong>{player.name}</strong>: {tricks[player.id]}
            </ResultsListItem>
          })}
        </ResultsList>
      </Container>
    )
  }
}

export const SetResults = connect(
  createSelector(
    getGameTricks,
    getGamePlayers,
    (tricks, players) => ({ tricks, players })
  ),
  () => ({})
)(SetResultsComponent)


export const ResultsList = styled.ul`
  border: 1px solid #000;
  max-width: 500px;
  margin: 20px auto;
  padding: 0;
  list-style: none;
`

export const ResultsListItem = styled.li`
  border-bottom: 1px solid #000;
  padding: 10px;
  
  :last-child {
    border-bottom: 0;
  }
`
