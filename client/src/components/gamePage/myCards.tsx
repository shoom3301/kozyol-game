import React, { Component } from 'react';
import { Title } from 'ui-elements/form';
import { cardImage } from 'helpers/cardImage';
import { Cards } from 'model/Card';
import { CardItem, CardsList, Container, MyCardSlot } from './elements';

export interface MyCardsProps {
  cards: Cards
}

export class MyCards extends Component<MyCardsProps, any> {
  render(): React.ReactElement {
    return (
      <Container>
        <Title>Мои карты:</Title>
        <CardsList>
          {this.props.cards.map(([suit, value]) => (
            <MyCardSlot key={`${suit}${value}`}><CardItem src={cardImage(value, suit)}/></MyCardSlot>
          ))}
        </CardsList>
      </Container>
    )
  }
}
