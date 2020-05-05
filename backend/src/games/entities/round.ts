import { Entity, Column, ManyToOne } from 'typeorm';

import { Desk, Cards } from '../cards/types';

import { Base } from './base';
import { User } from '../../user/user.entity';
import { Set } from './set';
import {
  range,
  takeLast,
  dropLast,
  isEmpty,
  values,
  without,
  toPairs,
  head,
  find,
  last,
  length,
  concat,
} from 'ramda';
import { isCardsGreater } from '../cards/comparisons';

@Entity()
export class Round extends Base {
  constructor(private prevRound?: Round) {
    super();
  }

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
    this.desk = [];
    this.currentPlayer = this.prevRound?.winner || this.set.game.players[0];
    this.fillHands();
  }

  get isDeskEmpty(): boolean {
    return this.desk.length === 0;
  }

  pushToDesk(cards: Cards, userId: number) {
    this.desk.push({ [userId]: cards });
    this.hands[userId] = without(cards, this.hands[userId]);

    if (this.isTurnGreater()) {
      this.winner = { id: userId } as User;
    }

    this.recalcRound();
  }

  isTurnGreater() {
    const turnsCount = this.desk.length - 1;
    if (turnsCount === 0) {
      return true;
    }

    const [_, prevUserCards] = head(toPairs(this.desk[turnsCount - 1]));
    const [__, currUserCards] = head(toPairs(this.desk[turnsCount]));
    return isCardsGreater(this.set.trump)(prevUserCards, currUserCards);
  }

  deskToDic(): { [player: number]: Cards } {
    return this.desk.reduce((acc, item) => {
      const pair = head(toPairs(item));
      acc[pair[0]] = pair[1];
      return acc;
    }, {});
  }

  isFinished() {
    // if all users pushed cards to desk
    return this.desk.length === this.set.game.players.length;
  }

  recalcRound() {
    if (!this.isFinished()) {
      // looking for the first player that didnt push cards to desk
      // TODO: !!!
      const nextPlayer = find(player => isEmpty(last(player)), toPairs(this.deskToDic()));
      if (nextPlayer) {
        const nextPlayerId = nextPlayer[0]; // toopaya ramda
        this.currentPlayer = { id: parseInt(nextPlayerId, 10) } as User;
      }
    } else {
      // TODO: блядь, забыл
    }
  }

  fillHands() {
    // calc cards delta (4 - on hands)
    let cardsToCharge = 4;

    if (this.prevRound) {
      // get first hand
      const firstHandCardsCount = length(head(values(this.prevRound.hands)));
      cardsToCharge = 4 - firstHandCardsCount;
    }

    const cardsDelta = Math.min(cardsToCharge, this.set.deck.length / this.set.game.players.length);
    const cardsForUsers = takeLast(cardsDelta * this.set.game.playersCount, this.set.deck);
    this.set.deck = dropLast(cardsForUsers.length, this.set.deck);
    this.hands = this.set.game.players.reduce((acc, item) => {
      acc[item.id] = concat(
        this.hands ? this.hands[item.id] : [],
        range(0, cardsDelta).map(() => cardsForUsers.pop()),
      );
      return acc;
    }, {});
  }
}
