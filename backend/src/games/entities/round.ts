import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

import { Desk, Cards } from '../cards/types';

import { Base } from './base';
import { User } from '../../user/user.entity';
import { Set } from './set';
import {
  range,
  takeLast,
  dropLast,
  values,
  without,
  toPairs,
  head,
  length,
  concat,
  prop,
  map,
  findIndex,
  propEq,
  slice,
  equals,
} from 'ramda';
import { isCardsGreater } from '../cards/comparisons';

@Entity()
export class Round extends Base {
  @ManyToOne(
    () => Set,
    set => set.rounds,
    { nullable: false },
  )
  set: Set;

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

  prevRound() {
    if (!this.prevRoundId) {
      return Promise.resolve(undefined);
    }
    return Round.findOne(this.prevRoundId);
  }

  async initRound(set: Set) {
    this.set = set;
    this.desk = [];
    const prevRound = await this.prevRound();
    this.currentPlayer = prevRound?.winner || this.set.game.players[0];
    await this.fillHands();
  }

  get isDeskEmpty(): boolean {
    return this.desk.length === 0;
  }

  async pushToDesk(cards: Cards, userId: number) {
    this.desk.push({ [userId]: cards });
    this.hands[userId] = without(cards, this.hands[userId]);

    if (this.isTurnGreater()) {
      this.winner = { id: userId } as User;
    }

    await this.recalcRound();
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

  // [{1: []}, {2:[]}] => {1:[], 2:[]}
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

  async recalcRound() {
    if (!this.isFinished()) {
      // looking for the first player that didnt push cards to desk
      const order = await this.getOrder();
      const currentPlayerIdx = findIndex(equals(this.currentPlayer.id), order);
      const nextPlayerId = order[currentPlayerIdx + 1];
      this.currentPlayer = { id: nextPlayerId } as User;
    } else {
      // TODO: блядь, забыл
    }
  }

  async fillHands() {
    // calc cards delta (4 - on hands)
    let cardsToCharge = 4;

    const prevRound = await this.prevRound();
    if (prevRound) {
      // get first hand
      const firstHandCardsCount = length(head(values(prevRound.hands)));
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

  async getOrder() {
    // TODO: check winner of prev set too

    const playersIds = map(prop('id'), this.set.game.players);

    const prevRound = await this.prevRound();
    if (!prevRound) {
      return map(prop('id'), this.set.game.players);
    }

    const prevWinnerId = prevRound.winner.id;
    const prevWinnerIdx = findIndex(propEq('id', prevWinnerId), this.set.game.players);

    // [1,2,3] => [1,2,3,1,2,3];
    const doubledPlayers = concat(playersIds, playersIds);

    // [1,2,3,1,2,3] => [_,_,{3,1,2},_]
    return slice(prevWinnerIdx, doubledPlayers.length - 1, doubledPlayers);
  }
}
