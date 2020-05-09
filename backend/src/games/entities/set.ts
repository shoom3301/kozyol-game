import { Entity, Column, ManyToOne, OneToMany, RelationId } from 'typeorm';

import { Deck, Suit, Cards } from '../cards/types';

import { Base } from './base';
import { Game } from './game';
import { Round } from './round';
import { randomSuit } from '../cards/utils';
import { makeDeck } from '../cards/make';
import {
  map,
  toPairs,
  head,
  sum,
  fromPairs,
  unnest,
  last,
  tail,
  descend,
  sortWith,
  prop,
  forEach,
  keys,
} from 'ramda';
import { startNewRound } from './round.utils';

@Entity('set')
export class GameSet extends Base {
  @ManyToOne(
    () => Game,
    game => game.sets,
    { nullable: false, eager: true },
  )
  game: Game;

  @RelationId((set: GameSet) => set.game)
  gameId: number;

  @OneToMany(
    () => Round,
    round => round.set,
    { cascade: true, eager: true, onDelete: 'CASCADE' },
  )
  rounds: Round[];

  @Column()
  trump: Suit;

  @Column({ type: 'json' })
  deck: Deck;

  @Column({ type: 'json' })
  score: { [playerId: number]: number };

  @Column({ default: false })
  finished: boolean;

  async initSet(game: Game) {
    this.game = game;
    this.trump = randomSuit();
    this.deck = makeDeck();
    this.rounds = [];
    this.score = game.players.reduce((acc, item) => {
      acc[item.id] = 0;
      return acc;
    }, {});

    const prevSet = await GameSet.findOne({
      where: { game },
      order: { createdAt: 'DESC' },
    });
    const { newRound, updatedDeck } = await startNewRound(
      map(prop('id'), game.players),
      this.deck,
      prevSet,
    );
    this.rounds.push(newRound);
    this.deck = updatedDeck;
  }

  currentRound() {
    return Round.findOne({
      where: { set: this },
      order: { createdAt: 'DESC' },
      relations: ['set'],
    });
  }

  lastRound() {
    return Round.findOne({
      where: { set: this },
      order: { createdAt: 'DESC' },
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
    // so hacky way to set 0 tricks for user
    const lastRoundHands = last(this.rounds).hands;
    const usersWithoutTricks = [];
    forEach(playerId => {
      if (!score[playerId]) {
        score[playerId] = 0;
        usersWithoutTricks.push(playerId);
      }
    }, keys(lastRoundHands));

    const sortedWinPairs = sortWith([descend(last)])(toPairs(score));
    const winnerOfGame = head(sortedWinPairs);
    const gameScores: [number, number][] = tail(sortedWinPairs).map(scorePair => {
      const playerTrick = scorePair[1];
      let res = 0;
      if (playerTrick < winnerOfGame[1]) {
        if (playerTrick === 0) {
          if (usersWithoutTricks.includes(parseInt(scorePair[0], 10))) {
            res = 6; // 0 points, 0 tricks
          } else {
            res = 4; // 1+ tricks, 0 points
          }
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
