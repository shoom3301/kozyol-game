import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GameGuard implements CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { user } = req;
    let gameId: string | null = null;
    switch (req.method) {
      case 'GET':
        gameId = req.params.gameId;
        break;
      case 'POST':
        gameId = req.body.gameId;
      default:
        break;
    }

    if (user && gameId) {
      // check that user in game
    }

    return Promise.resolve(false);
  }
}
