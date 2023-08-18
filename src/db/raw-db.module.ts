import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import RawDatabaseService from './raw-db.service';
import { IDBConfig } from '../config/config.interface';

@Global()
@Module({
  exports: [RawDatabaseService],
  providers: [
    RawDatabaseService,
    {
      provide: 'CONNECTION_POOL',
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IDBConfig>) => {
        return new Pool({
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          user: configService.get('POSTGRES_USER'),
          database: configService.get('POSTGRES_DB'),
          password: configService.get('POSTGRES_PASSWORD'),
        });
      },
    },
  ],
})
export default class DatabaseModule {}
