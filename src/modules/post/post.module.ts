import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

import Post from './post.entity';
import PostService from './post.service';
import AuthModule from '../auth/auth.module';
import PostController from './post.controller';
import PrismaModule from '../../prisma/prisma.module';
import PostSearchService from './post-search.service';
import { SearchModule } from '../search/search.module';
import { IRedisConfig } from '../../config/config.interface';
import { Post as MongoosePost, PostSchema } from './post.model';

@Module({
  imports: [
    AuthModule,
    SearchModule,
    PrismaModule,
    // CacheModule.register(),
    TypeOrmModule.forFeature([Post]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IRedisConfig>) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
    }),
    MongooseModule.forFeature([
      { name: MongoosePost.name, schema: PostSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PostSearchService],
})
export default class PostModule {}
