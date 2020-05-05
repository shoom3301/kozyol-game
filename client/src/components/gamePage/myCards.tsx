import React, { Component } from 'react';
import { Title } from 'ui-elements/form';
import { cardImage } from 'helpers/cardImage';
import { Card, Cards } from 'model/Card';
import { CardItem, CardsList, Container, MyCardSlot } from './elements';
import { canCardBeSelected } from 'helpers/stepHelpers';
import { Button } from 'ui-elements/button';
import { stepService } from 'services/step.service';
import { gameStateService } from 'services/gameState.service';

export interface MyCardsProps {
  cards: Cards
  gameId: number
  enabled: boolean
}

export interface MyCardsState {
  selectedCards: Cards
}

export class MyCards extends Component<MyCardsProps, MyCardsState> {
  state: MyCardsState = { selectedCards: [] }

  selectCard(card: Card) {
    if (this.isSelectedCard(card)) {
      this.setState({selectedCards: this.state.selectedCards.filter(item => item !== card)})

      return
    }

    if (!canCardBeSelected(card, this.state.selectedCards)) {
      return
    }

    this.setState({selectedCards: [...this.state.selectedCards, card]})
  }

  isSelectedCard(card: Card): boolean {
    return this.state.selectedCards.includes(card)
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
