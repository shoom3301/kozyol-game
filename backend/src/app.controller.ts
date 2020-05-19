/* eslint-disable @typescript-eslint/camelcase */
import { Controller, Req, Post, UseGuards, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('api/auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user);

    res.cookie('Authorization', access_token, { httpOnly: process.env.NODE_ENV === 'production' });
    res.end();
  }

  @Post('api/auth/signup')
  async signup(@Req() req: Request) {
    const existedUser = await this.userService.getByLogin(req.body.username);
    if (existedUser) {
      throw new HttpException('User exists', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const user = await this.userService.create(req.body.username, req.body.password);
    return this.authService.login({ username: user.login, pass: user.password });
  }
}
