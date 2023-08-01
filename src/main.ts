import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import runInCluster from './utils/runInCluster';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  // When performing partial changes, we need to skip missing properties.The most straightforward way to handle PATCH is to pass  skipMissingProperties to our  ValidationPipe.

  await app.listen(3000);
}

runInCluster(bootstrap);
