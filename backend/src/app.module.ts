import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { join } from 'path';

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

import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'client'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'db_user',
      password: '2SNJwgsfPFMtSWkw68bnzwUKmvbkaJpj',
      database: 'kozyol',
      // logging: true,
      entities: [User, Game, Round, GameSet],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    GamesModule,
  ],
  controllers: [AppController, GamesController, GameStateController, StepController],
  providers: [AppService, GamesService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
