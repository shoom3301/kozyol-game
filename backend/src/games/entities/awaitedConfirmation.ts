import { Entity, ManyToOne } from 'typeorm';
import { Base } from './base';
import { Game } from './game';
import { User } from '../../user/user.entity';

@Entity()
export class AwaitedConfirmation extends Base {
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  game: Game;

  @ManyToOne(() => User)
  player: User;
}
