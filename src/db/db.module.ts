import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import Post from '../modules/post/post.entity';
import User from '../modules/user/user.entity';
import Address from '../modules/user/address.entity';
import { IDBConfig } from '../config/config.interface';
import Category from '../modules/category/category.entity';
import PublicFile from '../modules/upload/pulicFile.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IDBConfig>) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        database: configService.get('POSTGRES_DB'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        // entities: [__dirname + '/../**/*.entity.ts'],
        entities: [Post, User, Address, Category, PublicFile],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export default class DatabaseModule {}
