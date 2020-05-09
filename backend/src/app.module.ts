import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { User } from './user/user.entity';
import { Game } from './games/entities/game';
import { Round } from './games/entities/round';
import { GameSet } from './games/entities/set';

import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';
import { GamesModule } from './games/games.module';
import { GameStateController } from './game-state/game-state.controller';
import { StepController } from './step/step.controller';
import { SubscribeController } from './subscribe/subscribe.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: 3306,
      username: process.env.MYSQL_USER || 'db_user',
      password: process.env.MYSQL_PASSWORD || '2SNJwgsfPFMtSWkw68bnzwUKmvbkaJpj',
      database: process.env.MYSQL_DATABASE || 'kozyol',
      // logging: true,
      entities: [User, Game, Round, GameSet],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    GamesModule,
  ],
  controllers: [AppController, GamesController, GameStateController, StepController, SubscribeController],
  providers: [AppService, GamesService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
