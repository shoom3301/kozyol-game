import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
//import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { CookieSerializer } from 'src/auth/cookie.serializer'

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true
    }),
    JwtModule.register({
      secret: 'a11ax_is_bicycle',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, CookieSerializer],
  exports: [AuthService],
})
export class AuthModule {}
