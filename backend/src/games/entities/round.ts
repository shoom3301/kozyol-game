import { Entity, Column, ManyToOne } from 'typeorm';

import { Desk, Cards } from '../cards/types';

import { Base } from './base';
import { User } from '../../user/user.entity';
import { Set } from './set';
import { range, takeLast, dropLast } from 'ramda';

@Entity()
export class Round extends Base {
  @ManyToOne(() => Set, { nullable: false })
  set: Set;

  @Column({ type: 'json' })
  desk: Desk;

  @Column({ type: 'json' })
  hands: { [playerId: number]: Cards };

  @ManyToOne(() => User, { nullable: false, eager: true })
  currentPlayer: User;

  @ManyToOne(() => User, { nullable: true })
  winner: User;

  initRound(set: Set) {
    this.set = set;
    this.desk = this.set.game.players.map(player => ({ [player.id]: [] }));
    this.currentPlayer = this.calcCurrentPlayer();
    this.fillHands();
  }

  // TODO: implement
  calcCurrentPlayer() {
    return this.set.game.players[0];
  }

  fillHands() {
    const cardsDelta = Math.min(4, this.set.deck.length / this.set.game.players.length);
    const cardsForUsers = takeLast(cardsDelta * this.set.game.playersCount, this.set.deck);
    this.set.deck = dropLast(cardsForUsers.length, this.set.deck);
    this.hands = this.set.game.players.reduce((acc, item) => {
      acc[item.id] = range(0, cardsDelta).map(() => cardsForUsers.pop());
      return acc;
    }, {});
  }
}
