import React, { Component } from 'react'
import { Title } from 'ui-elements/form'
import { cardImage } from 'helpers/cardImage'
import { Card, Cards, Desk } from 'model/Card'
import { CardItem, CardsList, Container, MyCardSlot } from './elements'
import { canCardBeSelected } from 'helpers/stepHelpers'
import { Button } from 'ui-elements/button'
import { stepService } from 'services/step.service'
import { ConfirmButton } from 'components/gamePage/confirmButton'
import { logError } from 'helpers/logError'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getCardsOnTable, getGameId, getGameStages, getIsMyTurn, getMyCards } from 'store/selectors/gameState'
import { getDeskItemCards } from 'helpers/getDeskItemCards'
import { isJsonEquals } from 'helpers/isJsonEquals'
import { GameStages } from 'model/GameState'
import { gamesService } from 'services/games.service'

export interface MyCardsProps {
  myCards: Cards
  cardsOnTable: Desk
  gameId: number
  isMyTurn: boolean
  gameStages: GameStages
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
    return !isJsonEquals(nextState, this.state) || !isJsonEquals(nextProps, this.props)
  }

  selectCard(card: Card) {
    const { cardsOnTable, isMyTurn } = this.props
    const isFirstStep = cardsOnTable.length === 0
    const selectedCards = this.state.selectedCards
    const maxCardsSelected = getDeskItemCards(cardsOnTable[0]).length === selectedCards.length

    if (this.isSelectedCard(card)) {
      this.setState({ selectedCards: selectedCards.filter(item => !isJsonEquals(item, card)) })

      return
    }

    if (!isMyTurn
      || (maxCardsSelected && !isFirstStep)
      || (!canCardBeSelected(card, selectedCards) && isFirstStep)
    ) {
      return
    }

    this.setState({ selectedCards: [...selectedCards, card] })
  }

  isSelectedCard(card: Card): boolean {
    return !!this.state.selectedCards.find(item => isJsonEquals(item, card))
  }

  doStep() {
    const selectedCards = this.state.selectedCards

    if (selectedCards.length === 0) {
      return
    }

    this.setState({ selectedCards: [] })

    stepService
      .doStep(this.props.gameId, selectedCards)
      .catch(logError)
  }

  confirm() {
    gamesService.continue(this.props.gameId)
      .catch(logError)
  }

  render(): React.ReactElement {
    const {
      myCards,
      gameStages,
      isMyTurn
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
        {isMyTurn && <Button onClick={() => this.doStep()}>Ходить</Button>}
        {gameStages.isWaitConfirm &&
        <ConfirmButton
            timeout={gameStages.isWaitNewSet ? 10000 : 5000}
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
    getGameStages,
    (myCards, cardsOnTable, gameId, isMyTurn, gameStages) => ({
      myCards,
      cardsOnTable,
      gameId,
      isMyTurn,
      gameStages
    })
  ),
  () => ({})
)(MyCardsComponent)
