import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import AuthModule from '../auth/auth.module';
import { IMicroserviceRMQConfig } from '../../config/config.interface';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: 'SUBSCRIBER_SERVICE',
      useFactory: (configService: ConfigService<IMicroserviceRMQConfig>) => {
        const user = configService.get('RABBITMQ_USER');
        const host = configService.get('RABBITMQ_HOST');
        const password = configService.get('RABBITMQ_PASSWORD');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: { durable: true },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export default class SubscriberModule {}
