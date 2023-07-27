import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import AuthModule from '../auth/auth.module';
import { IMicroserviceConfig } from '../../config/config.interface';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: 'SUBSCRIBER_SERVICE',
      useFactory: (configService: ConfigService<IMicroserviceConfig>) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('SUBSCRIBER_SERVICE_HOST'),
            port: configService.get('SUBSCRIBER_SERVICE_PORT'),
          },
        }),
      inject: [ConfigService],
    },
  ],
})
export default class SubscriberModule {}
