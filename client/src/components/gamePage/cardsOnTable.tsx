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
            <CardItem src={cardImage(Value.Six, Suit.Hearts)}/>
            <CardItem src={cardImage(Value.Eight, Suit.Hearts)}/>
            <CardItem src={cardImage(Value.Ten, Suit.Hearts)}/>
            <CardItem src={cardImage(Value.Ace, Suit.Hearts)}/>
          </CardSlot>
          <CardSlot><CardItem src={cardImage(Value.Ace, Suit.Diamonds)}/></CardSlot>
          <CardSlot><CardItem src={cardImage(Value.King, Suit.Spades)}/></CardSlot>
          <CardSlot><CardItem src={cardImage(Value.Seven, Suit.Clubs)}/></CardSlot>
        </CardsList>
      </Container>
    )
  }
}
