import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, { eager: true, nullable: false })
  owner: User;

  @Column()
  slotsCount: number;

  @Column({ nullable: true })
  playersCount: number;
}
