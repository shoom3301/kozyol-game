import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: true } });
  await app.listen(8041, '0.0.0.0');
}
bootstrap();
