import { Entity, Column, ManyToOne } from 'typeorm';

import { Desk, Cards } from '../cards/types';

import { Base } from './base';
import { User } from '../../user/user.entity';
import { GameSet } from './set';
import { values, without, toPairs, head, all, isEmpty } from 'ramda';
import { isCardsGreater } from '../cards/comparisons';
import { orderedTurns } from './round.utils';

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
    this.desk.push({ [userId]: cards });
    this.hands[userId] = without(cards, this.hands[userId]);

    if (this.isTurnGreater()) {
      this.winner = { id: userId } as User;
    }

    if (!this.isFinished()) {
      this.changeHand(playersIds);
    }
  }

  isTurnGreater() {
    const turnNumber = this.desk.length - 1;
    if (turnNumber === 0) {
      return true;
    }

    const [_, prevUserCards] = head(toPairs(this.desk[turnNumber - 1]));
    const [__, currUserCards] = head(toPairs(this.desk[turnNumber]));
    return isCardsGreater(this.set.trump)(prevUserCards, currUserCards);
  }

  isFinished() {
    // if all users pushed cards to desk
    return this.desk.length === this.set.game.players.length;
  }

  isHandsEmpty() {
    return all(isEmpty, values(this.hands));
  }

  async changeHand(playersIds: number[]) {
    const order = orderedTurns(this.currentPlayer.id, playersIds);
    this.currentPlayer = { id: order[1] } as User;
  }
}
