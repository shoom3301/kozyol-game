import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

import { User } from '../../user/user.entity';
import { Base } from './base';
import { GameSet } from './set';
import { map, prop, toPairs, unnest, values } from 'ramda';

@Entity()
export class Game extends Base {
  @ManyToOne(() => User, { eager: true, nullable: false, onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(
    () => GameSet,
    set => set.game,
    { onDelete: 'CASCADE' },
  )
  sets: GameSet[];

  @Column()
  slotsCount: number;

  @Column({ type: 'json' })
  waitConfirmations: User['id'][];

  @ManyToMany(
    () => User,
    user => user.games,
    { eager: true },
  )
  @JoinTable()
  players: User[];

  get playersCount() {
    return this.players.length;
  }

  hasAvailableSlots() {
    return this.players?.length < this.slotsCount;
  }

  hasPlayer(id: number) {
    return !!this.players.find(user => user.id === id);
  }

  initWaitingConfirmationsForContinue() {
    this.waitConfirmations = map(prop('id'), this.players);
  }

  gameScore(): { [playerId: number]: number } {
    // [id, score][]
    const setScores = unnest(map(set => toPairs(prop('score', set)), this.sets));

    // [id, score][] => {id: sum of scores}
    return setScores.reduce((acc, score) => {
      const [id, val] = score;
      if (!acc[id]) {
        acc[id] = val;
      } else {
        acc[id] = acc[id] + val;
      }
      return acc;
    }, {});
  }

  isFinished(): boolean {
    return values(this.gameScore()).find(score => score > 11) !== undefined;
  }

  async playingSet(): Promise<GameSet | undefined> {
    return GameSet.findOne({
      where: { game: this, finished: false },
      order: { createdAt: 'DESC' },
      relations: ['game'],
    });
  }

  async lastSet(): Promise<GameSet | undefined> {
    return GameSet.findOne({
      where: { game: this },
      order: { createdAt: 'DESC' },
      relations: ['rounds'],
    });
  }
}
