import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';

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
import { StepController } from './step/step.controller';
import { SubscribeController } from './subscribe/subscribe.controller';
import { SubscribeModule } from './subscribe/subscribe.module';
import { AwaitedConfirmation } from './games/entities/awaitedConfirmation';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      // logging: true,
      entities: [User, Game, Round, GameSet, AwaitedConfirmation],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    GamesModule,
    SubscribeModule,
  ],
  controllers: [AppController, GamesController, StepController, SubscribeController],
  providers: [AppService, GamesService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
