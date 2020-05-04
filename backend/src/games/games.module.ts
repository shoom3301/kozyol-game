import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GamesService } from './games.service';
import { Game } from './entities/game';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GamesService],
  exports: [TypeOrmModule, GamesService],
})
export class GamesModule {}
