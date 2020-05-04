import { Entity, Column, ManyToOne } from 'typeorm';

import { Desk, Cards } from '../cards/types';

import { Base } from './base';
import { User } from '../../user/user.entity';
import { Set } from './set';

@Entity()
export class Round extends Base {
  @ManyToOne(() => Set, { nullable: false, cascade: true })
  set: Set;

  @Column({ type: 'json' })
  desk: Desk;

  @Column({ type: 'json' })
  hands: { [playerId: number]: Cards };

  @ManyToOne(() => User, { nullable: false })
  currentPlayer: User;

  @ManyToOne(() => User)
  winner: User;
}
