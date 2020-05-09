import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { Game } from './entities/game';

@Injectable()
export class GameGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { user } = req;
    let gameId: string | null = null;
    switch (req.method) {
      case 'GET':
        gameId = req.params.gameId;
        break;
      case 'POST':
        gameId = req.body.gameId || req.params.gameId;
      default:
        break;
    }

    if (user && gameId) {
      // check that user in game
      const game = await Game.findOne({
        where: { id: parseInt(gameId, 10) },
        relations: ['players'],
      });
      if (!game) {
        throw new HttpException('Game not exist', HttpStatus.NOT_FOUND);
      }
      if (!game.hasPlayer(user.userId)) {
        throw new HttpException('You are not connected to game', HttpStatus.FORBIDDEN);
      }

      return true;
    }

    return false;
  }
}
