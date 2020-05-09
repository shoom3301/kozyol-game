import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'a11ax_is_bicycle',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  exports: [JwtModule],
})
export class SubscribeModule {}
