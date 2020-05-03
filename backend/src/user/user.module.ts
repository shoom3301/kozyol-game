import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './user.entity';
// import {  } from "./";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
