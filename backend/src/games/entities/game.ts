import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

import { User } from '../../user/user.entity';
import { Base } from './base';
import { Set } from './set';
import { map, prop, toPairs, unnest, values, gte } from 'ramda';

@Entity()
export class Game extends Base {
  @ManyToOne(() => User, { eager: true, nullable: false })
  owner: User;

  @OneToMany(
    () => Set,
    set => set.game,
    { cascade: true },
  )
  sets: Set[];

  @Column()
  slotsCount: number;

  @ManyToMany(() => User, { eager: true })
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

  async playingSet(): Promise<Set | undefined> {
    return Set.findOne({
      where: { game: this, finished: false },
      order: { createdAt: 'DESC' },
      relations: ['game'],
    });
  }
}
