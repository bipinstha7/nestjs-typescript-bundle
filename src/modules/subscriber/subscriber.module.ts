import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import AuthModule from '../auth/auth.module';
import {
  IMicroserviceConfig,
  IMicroserviceRMQConfig,
} from '../../config/config.interface';
import SubscriberController from './subscriber.controller';
import { join } from 'path';

// @Module({
//   imports: [ConfigModule, AuthModule],
//   controllers: [],
//   providers: [
//     {
//       provide: 'SUBSCRIBER_SERVICE',
//       useFactory: (configService: ConfigService<IMicroserviceConfig>) =>
//         ClientProxyFactory.create({
//           transport: Transport.TCP,
//           options: {
//             host: configService.get('SUBSCRIBER_SERVICE_HOST'),
//             port: configService.get('SUBSCRIBER_SERVICE_PORT'),
//           },
//         }),
//       inject: [ConfigService],
//     },
//   ],
// })

// @Module({
//   imports: [ConfigModule, AuthModule],
//   controllers: [],
//   providers: [
//     {
//       provide: 'SUBSCRIBER_SERVICE',
//       useFactory: (configService: ConfigService<IMicroserviceRMQConfig>) => {
//         const user = configService.get('RABBITMQ_USER');
//         const host = configService.get('RABBITMQ_HOST');
//         const password = configService.get('RABBITMQ_PASSWORD');
//         const queueName = configService.get('RABBITMQ_QUEUE_NAME');

//         return ClientProxyFactory.create({
//           transport: Transport.RMQ,
//           options: {
//             urls: [`amqp://${user}:${password}@${host}`],
//             queue: queueName,
//             queueOptions: { durable: true },
//           },
//         });
//       },
//       inject: [ConfigService],
//     },
//   ],
// })

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [SubscriberController],
  providers: [
    {
      provide: 'SUBSCRIBER_SERVICE',
      useFactory: (configService: ConfigService<IMicroserviceConfig>) =>
        ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'subscribers',
            protoPath: join(process.cwd(), 'src/subscriber/subscriber.proto'),
            url: configService.get('GRPC_CONNECTION_URL'),
          },
        }),

      inject: [ConfigService],
    },
  ],
})
export default class SubscriberModule {}
