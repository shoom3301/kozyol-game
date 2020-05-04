import { Controller, Req, Post, UseGuards, HttpException, HttpStatus, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { makeDeck } from './games/cards/make';

@Controller()
export class AppController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  async signup(@Req() req: Request) {
    const existedUser = await this.userService.getByLogin(req.body.username);
    if (existedUser) {
      throw new HttpException('User exists', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const user = await this.userService.create(req.body.username, req.body.password);
    return this.authService.login({ username: user.login, pass: user.password });
  }

  @Get('test')
  test() {
    return makeDeck();
  }
}
