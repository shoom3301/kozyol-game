import React, { Component } from 'react'
import { Title } from 'ui-elements/form'
import { cardImage } from 'helpers/cardImage'
import { Card, Cards, Desk } from 'model/Card'
import { CardItem, CardsList, Container, MyCardSlot } from './elements'
import { canCardBeSelected } from 'helpers/stepHelpers'
import { Button } from 'ui-elements/button'
import { stepService } from 'services/step.service'
import { gameStateService } from 'services/gameState.service'
import { ConfirmButton } from 'components/gamePage/confirmButton'
import { logError } from 'helpers/logError'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import {
  getCardsOnTable,
  getGameId,
  getIsMyTurn,
  getIsWaitingConfirmations,
  getIsWaitingForStartNewSet,
  getMyCards
} from 'store/selectors/gameState'

export interface MyCardsProps {
  myCards: Cards
  cardsOnTable: Desk
  gameId: number
  isMyTurn: boolean
  isWaitingConfirmations: boolean
  isWaitingForStartNewSet: boolean
}

export interface MyCardsState {
  selectedCards: Cards
}

export class MyCardsComponent extends Component<MyCardsProps, MyCardsState> {
  state: MyCardsState = { selectedCards: [] }

  shouldComponentUpdate(
    nextProps: Readonly<MyCardsProps>,
    nextState: Readonly<MyCardsState>,
    nextContext: any
  ): boolean {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  selectCard(card: Card) {
    const { cardsOnTable, isMyTurn } = this.props
    const isFirstStep = cardsOnTable.length === 0
    let firstStepCards = []

    if (!isFirstStep) {
      const firstStep = cardsOnTable[0]
      const firstUserId = parseInt(Object.keys(firstStep)[0])
      firstStepCards = firstStep[firstUserId]
    }

    if (this.isSelectedCard(card)) {
      this.setState({
        selectedCards: this.state.selectedCards.filter(
          (item) => JSON.stringify(item) !== JSON.stringify(card)
        ),
      })

      return
    }

    if (
      !isMyTurn ||
      (!isFirstStep &&
        firstStepCards.length === this.state.selectedCards.length)
    ) {
      return
    }

    if (isFirstStep && !canCardBeSelected(card, this.state.selectedCards)) {
      return
    }

    this.setState({ selectedCards: [...this.state.selectedCards, card] })
  }

  isSelectedCard(card: Card): boolean {
    return !!this.state.selectedCards.find(
      (item) => JSON.stringify(item) === JSON.stringify(card)
    )
  }

  doStep() {
    if (this.state.selectedCards.length === 0) {
      return
    }

    const cards = this.state.selectedCards

    this.setState({ selectedCards: [] })

    stepService
      .doStep(this.props.gameId, cards)
      .catch(logError)
      .then(() => {
        gameStateService.fetch()
      })
  }

  confirm() {
    stepService
      .confirm(this.props.gameId)
      .catch(logError)
      .then(() => {
        gameStateService.fetch()
      })
  }

  render(): React.ReactElement {
    const {
      myCards,
      isMyTurn,
      isWaitingConfirmations,
      isWaitingForStartNewSet
    } = this.props

    return (
      <Container>
        <Title>Мои карты:</Title>
        <CardsList>
          {myCards.map((card) => (
            <MyCardSlot
              key={`${card}`}
              selected={this.isSelectedCard(card)}
              onClick={() => this.selectCard(card)}
            >
              <CardItem src={cardImage(card)}/>
            </MyCardSlot>
          ))}
        </CardsList>
        {isMyTurn && (
          <Button onClick={() => this.doStep()}>
            Ногам ходу, голове приходу
          </Button>
        )}
        {isWaitingConfirmations &&
        <ConfirmButton
            timeout={isWaitingForStartNewSet ? 10000 : 5000}
            confirm={() => this.confirm()}/>
        }
      </Container>
    )
  }
}

export const MyCards = connect(
  createSelector(
    getMyCards,
    getCardsOnTable,
    getGameId,
    getIsMyTurn,
    getIsWaitingConfirmations,
    getIsWaitingForStartNewSet,
    (myCards, cardsOnTable, gameId, isMyTurn, isWaitingConfirmations, isWaitingForStartNewSet) => ({
      myCards,
      cardsOnTable,
      gameId,
      isMyTurn,
      isWaitingConfirmations,
      isWaitingForStartNewSet
    })
  ),
  () => ({})
)(MyCardsComponent)
