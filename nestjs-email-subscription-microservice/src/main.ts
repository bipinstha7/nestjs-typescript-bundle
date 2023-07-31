import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // await app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: { port: 40001 },
  // });

  // const user = configService.get('RABBITMQ_USER');
  // const password = configService.get('RABBITMQ_PASSWORD');
  // const host = configService.get('RABBITMQ_HOST');
  // const queueName = configService.get('RABBITMQ_QUEUE_NAME');

  // await app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [`amqp://${user}:${password}@${host}`],
  //     queue: queueName,
  //     queueOptions: { durable: true },
  //   },
  // });

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'subscribers',
      protoPath: join(process.cwd(), 'src/subscriber.proto'),
      url: configService.get('GRPC_CONNECTION_URL'),
    },
  });

  app.startAllMicroservices();
}
bootstrap();
