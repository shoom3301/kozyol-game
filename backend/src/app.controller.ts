/* eslint-disable @typescript-eslint/camelcase */
import { Controller, Req, Post, UseGuards, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('api/auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user);

    res.cookie('Authorization', access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30d
    });
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

  @UseGuards(JwtAuthGuard)
  ping(@Res() res: Response) {
    res.status(200).send('pong');
  }
}
