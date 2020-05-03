import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, { eager: true, nullable: false })
  owner: User;

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
}
