import { Controller, UseGuards, Get, Req, Res, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response, Request } from 'express';
import { forEach, values, assocPath, dissocPath, toPairs } from 'ramda';
import { Game } from 'src/games/entities/game';
import { calcGameState } from 'src/game-state/calcGameState';
import { JwtService } from '@nestjs/jwt';
import { GameGuard } from 'src/games/games.guard';

type GameEventType = 'list' | 'state';
type SseChunkDataType = { data: string; event: GameEventType };
const sseChunkData = ({ data, event }: SseChunkDataType) =>
  Object.entries({ event, data })
    .filter(([, value]) => ![undefined, null].includes(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n') + '\n\n';

const listConns: { [clientId: number]: Response } = {};
let gamesConns: {
  [gameId: number]: {
    [clientId: number]: Response;
  };
} = {};

const availabeGames = async () => {
  const games = await Game.find();
  return games.filter(game => game.hasAvailableSlots());
};

const broadcast = (data: SseChunkDataType, res?: Response) => {
  res.write(sseChunkData(data));
  res.flush();
};

export const broadcastGameState = async (gameId: number) => {
  const game = await Game.findOne({ where: { id: gameId }, relations: ['sets'] });

  const promises = toPairs(gamesConns[gameId]).map(async ([userId, res]) => {
    const gameState = await calcGameState(game, parseInt(userId, 10));
    const gameStateString = JSON.stringify(gameState);
    res?.write(sseChunkData({ data: gameStateString, event: 'state' }));
    res?.flush();
  });

  await Promise.all(promises);
};

export const broadcastGamesList = async () => {
  const games = await availabeGames();
  const availabeGamesString = JSON.stringify(games);
  forEach(res => {
    broadcast({ data: availabeGamesString, event: 'list' }, res);
  }, values(listConns));
};

@Controller('api/subscribe')
export class SubscribeController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(JwtAuthGuard, GameGuard)
  @Get('game/:gameId')
  async subscribeToGame(
    @Param('gameId') gameId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (req.headers.accept !== 'text/event-stream') {
      res.end();
      return;
    }

    res.setHeader('content-type', 'text/event-stream');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Connection', 'keep-alive');
    res.on('close', () => {
      console.log('conn closed for user with id %d in game %d', req.user.id, gameId);
      gamesConns = dissocPath([`${gameId}`, `${req.user.id}`], gamesConns);
    });
    gamesConns = assocPath([`${gameId}`, `${req.user.id}`], res, gamesConns);

    await broadcastGameState(gameId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async subscribeToGamesList(@Req() req: Request, @Res() res: Response) {
    if (req.headers.accept !== 'text/event-stream') {
      res.end();
      return;
    }

    res.setHeader('content-type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.on('close', () => {
      delete listConns[`${req.user.id}`];
      console.log('[list] conn closed for user with id %d', req.user.id);
    });
    listConns[`${req.user.id}`] = res;

    const games = await availabeGames();
    const availabeGamesString = JSON.stringify(games);
    broadcast({ data: availabeGamesString, event: 'list' }, res);
  }
}
