import React, { Component } from 'react'
import { Title } from 'ui-elements/form'
import { Container } from './elements'
import { Player } from 'model/Player'
import styled from 'styled-components'

export interface SetResultsProps {
  tricks: {
    [playerId: number]: number
  }
  players: Player[]
}

export class SetResults extends Component<SetResultsProps, any> {
  render(): React.ReactElement {
    return (
      <Container>
        <Title>Итоги круга:</Title>
        <ResultsList>
          {this.props.players.map(player => {
            return <ResultsListItem><strong>{player.name}</strong>: {this.props.tricks[player.id]}</ResultsListItem>
          })}
        </ResultsList>
      </Container>
    )
  }
}

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
