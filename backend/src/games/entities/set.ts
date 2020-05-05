import { Entity, Column, ManyToOne, OneToMany, RelationId } from 'typeorm';

import { Deck, Suit, Trick } from '../cards/types';

import { Base } from './base';
import { Game } from './game';
import { Round } from './round';
import { randomSuit } from '../cards/utils';
import { makeDeck } from '../cards/make';

@Entity()
export class Set extends Base {
  @ManyToOne(
    () => Game,
    game => game.sets,
    { nullable: false, eager: true },
  )
  game: Game;

  @RelationId((set: Set) => set.game)
  gameId: number;

  @OneToMany(
    () => Round,
    round => round.set,
    { cascade: true, eager: true },
  )
  rounds: Round[];

  @Column()
  trump: Suit;

  @Column({ type: 'json' })
  deck: Deck;

  @Column({ type: 'json' })
  tricks: { [playerId: number]: Trick };

  @Column({ type: 'json' })
  score: { [playerId: number]: number };

  @Column({ default: false })
  finished: boolean;

  initSet(game: Game) {
    this.game = game;

    this.trump = randomSuit();
    this.deck = makeDeck();
    this.score = game.players.reduce((acc, item) => {
      acc[item.id] = 0;
      return acc;
    }, {});
    this.tricks = game.players.reduce((acc, item) => {
      acc[item.id] = [];
      return acc;
    }, {});

    const round = new Round();
    round.initRound(this);

    if (!this.rounds) {
      this.rounds = [];
    }
    this.rounds.push(round);
  }

  // TODO: test
  currentRound() {
    return Round.findOne({
      where: { set: this },
      order: { createdAt: 'DESC' },
      relations: ['set'],
    });
  }

  async recalculate() {
    // TODO: if deck isEmpty, calc scores
    await this.reload();
  }
}
