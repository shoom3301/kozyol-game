import { Index, Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Game } from 'src/games/entities/game';
import { Base } from 'src/games/entities/base';

@Entity()
export class User extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  login: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(
    () => Game,
    game => game.players,
  )
  games: Game[];
}
