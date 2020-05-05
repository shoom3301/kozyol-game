import React, { Component } from 'react';
import { Title } from 'ui-elements/form';
import { cardImage } from 'helpers/cardImage';
import { Card, Cards, Desk } from 'model/Card';
import { CardItem, CardsList, Container, MyCardSlot } from './elements';
import { canCardBeSelected } from 'helpers/stepHelpers';
import { Button } from 'ui-elements/button';
import { stepService } from 'services/step.service';
import { gameStateService } from 'services/gameState.service';

export interface MyCardsProps {
  cards: Cards
  gameId: number
  enabled: boolean
  cardsOnTable: Desk
}

export interface MyCardsState {
  selectedCards: Cards
}

export class MyCards extends Component<MyCardsProps, MyCardsState> {
  state: MyCardsState = { selectedCards: [] }

  shouldComponentUpdate(
    nextProps: Readonly<MyCardsProps>,
    nextState: Readonly<MyCardsState>,
    nextContext: any): boolean {
    return JSON.stringify(nextState) !== JSON.stringify(this.state)
      || JSON.stringify(nextProps) !== JSON.stringify(this.props)
  }

  selectCard(card: Card) {
    const isFirstStep = this.props.cardsOnTable.length === 0
    let firstStepCards = []

    if (!isFirstStep) {
      const firstStep = this.props.cardsOnTable[0]
      const firstUserId = parseInt(Object.keys(firstStep)[0])
      firstStepCards = firstStep[firstUserId]
    }

    if (this.isSelectedCard(card)) {
      this.setState({
        selectedCards: this.state.selectedCards.filter(item => JSON.stringify(item) !== JSON.stringify(card))
      })

      return
    }

    if (!this.props.enabled || (!isFirstStep && firstStepCards.length === this.state.selectedCards.length)) {
      return
    }

    if (isFirstStep && !canCardBeSelected(card, this.state.selectedCards)) {
      return
    }

    this.setState({selectedCards: [...this.state.selectedCards, card]})
  }

  isSelectedCard(card: Card): boolean {
    return !!this.state.selectedCards.find(item => JSON.stringify(item) === JSON.stringify(card))
  }

  doStep() {
    if (this.state.selectedCards.length === 0) {
      return
    }

    const cards = this.state.selectedCards

    this.setState({selectedCards: []})

    stepService
      .doStep(this.props.gameId, cards)
      .catch(alert)
      .then(() => {
        gameStateService.fetch()
      })
  }

  render(): React.ReactElement {
    return (
      <Container>
        <Title>Мои карты:</Title>
        <CardsList>
          {this.props.cards.map(card => (
            <MyCardSlot
              key={`${card}`}
              selected={this.isSelectedCard(card)}
              onClick={() => this.selectCard(card)}>
              <CardItem src={cardImage(card)}/>
            </MyCardSlot>
          ))}
        </CardsList>
        {this.props.enabled && <Button onClick={() => this.doStep()}>Ногам ходу, голове приходу</Button>}
      </Container>
    )
  }
}
