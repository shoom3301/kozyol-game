import React, { Component } from 'react'
import { Title } from 'ui-elements/form'
import { cardImage } from 'helpers/cardImage'
import { Card, Desk, suitIsRed, suitSymbols } from 'model/Card'
import { CardItemOnTable, CardsList, CardSlot, Container } from './elements'
import styled, { css } from 'styled-components'

const cardBack = 'https://raw.githubusercontent.com/richardschneider/cardsJS/' +
  'fe5e857c5094468c58a7cfe0a7075ad351fc7920/cards/BLUE_BACK.svg'
const cardsInDeckTotal = 36

export interface CardsOnTableProps {
  cards: Desk
  trump: number
  cardsInDeck: number
}

export class CardsOnTable extends Component<CardsOnTableProps, any> {
  render(): React.ReactElement {
    const slots: (Card | null)[][] = []

    if (this.props.cards.length > 0) {
      const first = this.props.cards[0]
      const firstUserId = parseInt(Object.keys(first)[0])
      const firstCards = first[firstUserId]
      const slotsCount = firstCards.length

      for (let i = 0; i < slotsCount; i++) {
        this.props.cards.forEach(item => {
          const userId = parseInt(Object.keys(item)[0])
          const cards = item[userId]

          slots[i] = slots[i] || []
          slots[i].push(cards[i])
        })
      }
    }

    return (
      <Container>
        <Title>Колода: {this.props.cardsInDeck || 0}/{cardsInDeckTotal}. Козырь:
          <SuitSymbol isRed={suitIsRed[this.props.trump]}>{suitSymbols[this.props.trump]}</SuitSymbol>
          )</Title>
        <CardsList>
          {slots.map((slot, i) =>
            <CardSlot key={i} cardsCount={slot.length}>{slot.map((card, j) => {
              const key = card ? card.toString() : j
              const image = card ? cardImage(card) : cardBack

              return <CardItemOnTable key={key} src={image}/>
            })}
            </CardSlot>
          )}
        </CardsList>
      </Container>
    )
  }
}

export const SuitSymbol = styled.span<{ isRed?: boolean }>`
  font-size: 24px;
  line-height: 18px;
  font-weight: bold;
  margin: 0 5px;
  display: inline-block;
  border: 1px solid #4e4e4e;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  padding: 5px;

  ${({ isRed }) => isRed && css`
    color: red;
  `}
`
