import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { Deck, Suit, Trick } from '../cards/types';

import { Base } from './base';
import { Game } from './game';
import { Round } from './round';
import { randomEnumValue } from '../cards/utils';

@Entity()
export class Set extends Base {
  @ManyToOne(() => Game, { nullable: false, cascade: true })
  game: Game;

  @OneToMany(
    () => Round,
    round => round.set,
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

  // static initSet = (game: GameItem): Promise<Set | undefined> => {
  //   const trump = randomEnumValue(Suit);
  // };
}
