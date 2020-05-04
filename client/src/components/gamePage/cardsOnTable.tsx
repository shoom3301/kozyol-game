import React, { Component } from 'react';
import { Title } from 'ui-elements/form';
import { cardImage } from 'helpers/cardImage';
import { Cards, Desk } from 'model/Card';
import { CardItem, CardsList, CardSlot, Container } from './elements';

export interface CardsOnTableProps {
  cards: Desk
}

export class CardsOnTable extends Component<CardsOnTableProps, any> {
  render(): React.ReactElement {
    const first = this.props.cards[0]
    const firstUserId = parseInt(Object.keys(first)[0])
    const firstCards = first[firstUserId]
    const slotsCount = firstCards.length
    const slots: Cards[] = []

    for (let i = 0; i < slotsCount; i++) {
      this.props.cards.forEach(item => {
        const userId = parseInt(Object.keys(item)[0])
        const cards = item[userId]

        slots[i] = slots[i] || []

        if (cards[i]) {
          slots[i].push(cards[i])
        }
      })
    }

    return (
      <Container>
        <Title>Карты на столе:</Title>
        <CardsList>
          {slots.map((slot, i) => <CardSlot key={i}>{slot.map(card =>
            <CardItem key={card.toString()} src={cardImage(card)}/>
          )}</CardSlot>)}
        </CardsList>
      </Container>
    )
  }
}
