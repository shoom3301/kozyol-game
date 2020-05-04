import React, { Component } from 'react';
import { Title } from 'ui-elements/form';
import { cardImage } from 'helpers/cardImage';
import { Suit, Value } from 'model/Card';
import { CardItem, CardsList, CardSlot, Container } from './elements';

export class CardsOnTable extends Component<any, any> {
  render(): React.ReactElement {
    return (
      <Container>
        <Title>Карты на столе:</Title>
        <CardsList>
          <CardSlot>
            <CardItem src={cardImage([Suit.Hearts, Value.Six])}/>
            <CardItem src={cardImage([Suit.Hearts, Value.Eight])}/>
            <CardItem src={cardImage([Suit.Hearts, Value.Ten])}/>
            <CardItem src={cardImage([Suit.Hearts, Value.Ace])}/>
          </CardSlot>
          <CardSlot><CardItem src={cardImage([Suit.Diamonds, Value.Ace])}/></CardSlot>
          <CardSlot><CardItem src={cardImage([Suit.Spades, Value.King])}/></CardSlot>
          <CardSlot><CardItem src={cardImage([Suit.Clubs, Value.Seven])}/></CardSlot>
        </CardsList>
      </Container>
    )
  }
}
