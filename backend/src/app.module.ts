import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

import { User } from './user/user.entity';
import { GamesController } from './games/games.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'db_user',
      password: '2SNJwgsfPFMtSWkw68bnzwUKmvbkaJpj',
      database: 'kozyol',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, GamesController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
