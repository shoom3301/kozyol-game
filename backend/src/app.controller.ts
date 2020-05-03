import { Controller, Req, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Req() req: Request) {
    return req.user;
  }

  @Post('auth/signup')
  async signup(@Req() req: Request) {
    const existedUser = await this.userService.getByLogin(req.body.login);
    if (existedUser) {
      throw new HttpException('User exists', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const user = await this.userService.create(req.body.login, req.body.password);
    return user.login;
  }
}
