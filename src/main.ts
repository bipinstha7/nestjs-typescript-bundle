import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import runInCluster from './utils/runInCluster';
import rawBodyMiddleware from './middleware/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  // When performing partial changes, we need to skip missing properties.The most straightforward way to handle PATCH is to pass  skipMissingProperties to our  ValidationPipe.

  app.use(rawBodyMiddleware());

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  await app.listen(3000);
}

runInCluster(bootstrap);
