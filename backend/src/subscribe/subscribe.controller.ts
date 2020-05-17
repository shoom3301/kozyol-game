import {
  Controller,
  UseGuards,
  Get,
  Req,
  Res,
  HttpException,
  HttpStatus,
  Query,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response, Request } from 'express';
import { forEach, values, assoc, dissoc, assocPath, dissocPath, toPairs } from 'ramda';
import { Game } from 'src/games/entities/game';
import { calcGameState } from 'src/game-state/calcGameState';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { GameGuard } from 'src/games/games.guard';

type GameEventType = 'list' | 'state';
type SseChunkDataType = { data: string; event: GameEventType };
const sseChunkData = ({ data, event }: SseChunkDataType) =>
  Object.entries({ event, data })
    .filter(([, value]) => ![undefined, null].includes(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n') + '\n\n';

let listConns: { [clientId: number]: Response } = {};
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
  console.log('Broadcasting ', sseChunkData(data));

  res?.write(sseChunkData(data));
};

export const broadcastGameState = async (gameId: number) => {
  const game = await Game.findOne({ where: { id: gameId }, relations: ['sets'] });

  const promises = toPairs(gamesConns[gameId]).map(async ([userId, res]) => {
    const gameState = await calcGameState(game, parseInt(userId, 10));
    const gameStateString = JSON.stringify(gameState);
    res?.write(sseChunkData({ data: gameStateString, event: 'state' }));
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

    gamesConns = assocPath([gameId, req.user.id], res, gamesConns);
    res.on('close', () => {
      console.log('conn closed for user with id %d in game %d', req.user.id, gameId);
      gamesConns = dissocPath([gameId, req.user.id], gamesConns);
    });

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
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Connection', 'keep-alive');

    listConns = assoc(`${req.user.id}`, res, listConns);
    res.on('close', () => {
      console.log('conn closed for user with id %d', req.user.id);
      listConns = dissoc(`${req.user.id}`, listConns);
    });

    const games = await availabeGames();
    const availabeGamesString = JSON.stringify(games);
    broadcast({ data: availabeGamesString, event: 'list' }, res);
  }
}
