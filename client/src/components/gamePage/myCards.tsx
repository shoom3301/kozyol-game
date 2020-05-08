import React, { Component } from "react";
import { Title } from "ui-elements/form";
import { cardImage } from "helpers/cardImage";
import { Card, Cards, Desk } from "model/Card";
import { CardItem, CardsList, Container, MyCardSlot } from "./elements";
import { canCardBeSelected } from "helpers/stepHelpers";
import { Button } from "ui-elements/button";
import { stepService } from "services/step.service";
import { gameStateService } from "services/gameState.service";
import { ConfirmButton } from 'components/gamePage/confirmButton';
import { GameStateHelpers } from 'helpers/gameStateHelpers';
import { logError } from 'helpers/logError';

export interface MyCardsProps {
  gameState: GameStateHelpers
}

export interface MyCardsState {
  selectedCards: Cards
}

export class MyCards extends Component<MyCardsProps, MyCardsState> {
  state: MyCardsState = { selectedCards: [] };

  shouldComponentUpdate(
    nextProps: Readonly<MyCardsProps>,
    nextState: Readonly<MyCardsState>,
    nextContext: any
  ): boolean {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    );
  }

  selectCard(card: Card) {
    const gameState = this.props.gameState
    const cardsOnTable = gameState.gameState.cardsOnTable
    const isFirstStep = cardsOnTable.length === 0;
    let firstStepCards = [];

    if (!isFirstStep) {
      const firstStep = cardsOnTable[0];
      const firstUserId = parseInt(Object.keys(firstStep)[0]);
      firstStepCards = firstStep[firstUserId];
    }

    if (this.isSelectedCard(card)) {
      this.setState({
        selectedCards: this.state.selectedCards.filter(
          (item) => JSON.stringify(item) !== JSON.stringify(card)
        ),
      });

      return;
    }

    if (
      !gameState.isMyTurn ||
      (!isFirstStep &&
        firstStepCards.length === this.state.selectedCards.length)
    ) {
      return;
    }

    if (isFirstStep && !canCardBeSelected(card, this.state.selectedCards)) {
      return;
    }

    this.setState({ selectedCards: [...this.state.selectedCards, card] });
  }

  isSelectedCard(card: Card): boolean {
    return !!this.state.selectedCards.find(
      (item) => JSON.stringify(item) === JSON.stringify(card)
    );
  }

  doStep() {
    if (this.state.selectedCards.length === 0) {
      return;
    }

    const cards = this.state.selectedCards;

    this.setState({ selectedCards: [] });

    stepService
      .doStep(this.props.gameState.gameState.id, cards)
      .catch(logError)
      .then(() => {
        gameStateService.fetch();
      });
  }

  confirm() {
    stepService
      .confirm(this.props.gameState.gameState.id)
      .catch(logError)
      .then(() => {
        gameStateService.fetch();
      });
  }

  render(): React.ReactElement {
    const gameState = this.props.gameState

    return (
      <Container>
        <Title>Мои карты:</Title>
        <CardsList>
          {gameState.gameState.myCards.map((card) => (
            <MyCardSlot
              key={`${card}`}
              selected={this.isSelectedCard(card)}
              onClick={() => this.selectCard(card)}
            >
              <CardItem src={cardImage(card)} />
            </MyCardSlot>
          ))}
        </CardsList>
        {gameState.isMyTurn && (
          <Button onClick={() => this.doStep()}>
            Ногам ходу, голове приходу
          </Button>
        )}
        {gameState.isWaitingConfirmations &&
        <ConfirmButton
          timeout={gameState.isWaitingForStartNewSet ? 10000 : 5000}
          confirm={() => this.confirm()}/>
        }
      </Container>
    );
  }
}
