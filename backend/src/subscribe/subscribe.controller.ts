import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response, Request } from 'express';
import { forEach, values, assoc, dissoc } from 'ramda';
import { Game } from 'src/games/entities/game';
import { calcGameState } from 'src/game-state/calcGameState';
import { User } from '../user/user.entity';

type GameEventType = 'list' | 'state';
type SseChunkDataType = { data: string; event: GameEventType };
const sseChunkData = ({ data, event }: SseChunkDataType) =>
  Object.entries({ event, data })
    .filter(([, value]) => ![undefined, null].includes(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n') + '\n\n';

let conns: { [clientId: number]: Response } = {};

export const broadcastGameState = async (gameId: number) => {
  const game = await Game.findOne({ where: { id: gameId }, relations: ['sets'] });

  const promises = game.players.map(async player => {
    const gameState = await calcGameState(game, player.id);
    const gameStateString = JSON.stringify(gameState);
    const res = conns[`${player.id}`];
    res?.write(sseChunkData({ data: gameStateString, event: 'state' }));
  });

  await Promise.all(promises);
};

export const broadcastGamesList = async () => {
  const games = await Game.find();
  const availabeGames = games.filter(game => game.hasAvailableSlots());
  const availabeGamesString = JSON.stringify(availabeGames);
  forEach(res => {
    res?.write(sseChunkData({ data: availabeGamesString, event: 'list' }));
  }, values(conns));
};

@UseGuards(JwtAuthGuard)
@Controller('api/subscribe')
export class SubscribeController {
  @Get()
  async subscribeToUpdates(@Req() req: Request, @Res() res: Response) {
    if (req.headers.accept !== 'text/event-stream') {
      res.end();
      return;
    }
    res.setHeader('content-type', 'text/event-stream');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Connection', 'keep-alive');

    conns = assoc(`${req.user.userId}`, res, conns);
    res.on('close', () => {
      console.log('conn closed for user with id %d', req.user.userId);
      conns = dissoc(`${req.user.userId}`, conns);
    });

    const user = await User.findOne({
      where: { id: req.user.userId },
      relations: ['games', 'games.sets'],
    });
    const promises = user.games
      .filter(game => !game.isFinished())
      .map(async game => {
        const gameState = await calcGameState(game, user.id);
        const gameStateString = JSON.stringify(gameState);
        const res = conns[`${user.id}`];
        res?.write(sseChunkData({ data: gameStateString, event: 'state' }));
      });
    await Promise.all(promises);
  }
}
