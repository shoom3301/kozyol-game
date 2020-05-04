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
import { Set } from './games/entities/set';

import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'db_user',
      password: '2SNJwgsfPFMtSWkw68bnzwUKmvbkaJpj',
      database: 'kozyol',
      entities: [User, Game, Round, Set],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    GamesModule,
  ],
  controllers: [AppController, GamesController],
  providers: [AppService, GamesService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
