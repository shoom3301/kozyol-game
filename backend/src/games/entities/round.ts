import { Entity, Column, ManyToOne } from 'typeorm';

import { Desk, Cards } from '../cards/types';

import { Base } from './base';
import { User } from '../../user/user.entity';
import { GameSet } from './set';
import { values, without, all, isEmpty } from 'ramda';
import { isCardsGreater } from '../cards/comparisons';
import { orderedTurns, deskToObj } from './round.utils';
import { prettifyWinnerTurn } from '../cards/utils';

@Entity()
export class Round extends Base {
  @ManyToOne(
    () => GameSet,
    set => set.rounds,
    { nullable: false },
  )
  set: GameSet;

  @Column({ type: 'json' })
  desk: Desk;

  @Column({ type: 'json' })
  hands: { [playerId: number]: Cards };

  @ManyToOne(() => User, { nullable: false, eager: true })
  currentPlayer: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  winner: User;

  @Column({ nullable: true })
  prevRoundId: number;

  get isDeskEmpty(): boolean {
    return this.desk.length === 0;
  }

  async pushToDesk(cards: Cards, userId: number, playersIds: number[]) {
    if (this.isDeskEmpty) {
      this.desk.push({ [userId]: cards });
      this.winner = { id: userId } as User;
    } else if (this.isTurnGreater(cards)) {
      this.desk.push({
        [userId]: prettifyWinnerTurn(this.set.trump)(this.getCurrentWinnerCards(), cards),
      });
      this.winner = { id: userId } as User;
    } else {
      this.desk.push({ [userId]: cards });
    }
    this.hands[userId] = without(cards, this.hands[userId]);

    if (!this.isFinished()) {
      this.changeHand(playersIds);
    }
  }

  getCurrentWinnerCards() {
    return deskToObj(this.desk)[this.winner.id];
  }

  isTurnGreater(cards: Cards) {
    if (!this.winner) {
      return true;
    }

    const roundCurrentWinnerCards = this.getCurrentWinnerCards();
    const currUserCards = cards;

    return isCardsGreater(this.set.trump)(roundCurrentWinnerCards, currUserCards);
  }

  isFinished() {
    // if all users pushed cards to desk
    return this.desk.length === this.set.game.players.length;
  }

  isFinishedWithSet(set: GameSet) {
    return this.desk.length === set.game.players.length;
  }

  isHandsEmpty() {
    return all(isEmpty, values(this.hands));
  }

  async changeHand(playersIds: number[]) {
    const order = orderedTurns(this.currentPlayer.id, playersIds);
    this.currentPlayer = { id: order[1] } as User;
  }
}
