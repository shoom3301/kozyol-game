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
    const slots: Cards[] = []

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
