import { Entity, Column, ManyToOne, OneToMany, RelationId } from 'typeorm';

import { Deck, Suit, Trick, Cards } from '../cards/types';

import { Base } from './base';
import { Game } from './game';
import { Round } from './round';
import { randomSuit } from '../cards/utils';
import { makeDeck } from '../cards/make';
import { map, toPairs, head, sum, fromPairs, unnest, last, tail, descend, sortWith } from 'ramda';

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

  async initSet(game: Game) {
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

    await this.save();
    await this.reload();

    const round = new Round();
    await round.initRound(this);
    await round.save();
    await round.reload();

    if (!this.rounds) {
      this.rounds = [];
    }
    this.rounds.push(round);
  }

  currentRound() {
    return Round.findOne({
      where: { set: this },
      order: { createdAt: 'DESC' },
      relations: ['set'],
    });
  }

  async calcScores() {
    this.finished = true;

    const playersTricks: { [id: number]: Cards } = this.rounds.reduce((acc, round) => {
      const winnerId = round.winner.id;
      if (!acc[winnerId]) {
        acc[winnerId] = [];
      }

      const tricks = map(trick => head(toPairs(trick))[1], round.desk);
      acc[winnerId] = [...acc[winnerId], ...unnest(tricks)];
      return acc;
    }, {});

    const scoresPairs = map(pair => {
      const cardsSum = sum(map(card => (card[1] > 100 ? card[1] - 100 : 0), pair[1]));
      return [pair[0], cardsSum];
    }, toPairs(playersTricks));

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const score: { [id: number]: number } = fromPairs(scoresPairs);

    const sortedWinPairs = sortWith([descend(last)])(toPairs(score));

    const winnerOfGame = head(sortedWinPairs);
    const gameScores: [number, number][] = tail(sortedWinPairs).map(scorePair => {
      const playerTrick = scorePair[1];
      let res = 0;
      if (playerTrick < winnerOfGame[1]) {
        if (playerTrick === 0) {
          res = 6;
        } else if (playerTrick < 31) {
          res = 4;
        } else {
          res = 2;
        }
      }

      return [parseInt(scorePair[0], 10), res];
    });

    const result = fromPairs([...gameScores, [winnerOfGame[0], 0]]);
    this.score = result;
  }
}
