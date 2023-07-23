import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import IConfig from '../config/config.interface';
import Post from 'src/modules/post/post.entity';
import User from 'src/modules/user/entity/user.entity';
import Category from 'src/modules/category/category.entity';
import Address from 'src/modules/user/entity/address.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IConfig>) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        database: configService.get('POSTGRES_DB'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        // entities: [__dirname + '/../**/*.entity.ts'],
        entities: [Post, User, Address, Category],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export default class DatabaseModule {}
