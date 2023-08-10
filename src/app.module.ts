import { join } from 'path';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import DatabaseModule from './db/db.module';
import PostModule from './modules/post/post.module';
import UserModule from './modules/user/user.module';
import AuthModule from './modules/auth/auth.module';
import EmailModule from './modules/email/email.module';
import { IMongoConfig, IRedisConfig } from './config/config.interface';
import ConfigValidation from './config/config.validation';
import CommentModule from './modules/comment/comment.module';
import CategoryModule from './modules/category/category.module';
import { ExceptionsLoggerFilter } from './utils/exceptionsLogger.filter';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    EmailModule,
    CommentModule,
    DatabaseModule,
    CategoryModule,
    /* The ScheduleModule.forRoot method initializes the scheduler. It also registers all the cron jobs we define declaratively across our application. */
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ validationSchema: ConfigValidation() }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
        autoSchemaFile: join(process.cwd(), '/src/schema.gql'),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IRedisConfig>) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IMongoConfig>) => {
        const host = configService.get('MONGO_HOST');
        const username = configService.get('MONGO_USERNAME');
        const password = configService.get('MONGO_PASSWORD');
        const database = configService.get('MONGO_DATABASE');

        return { uri: `mongodb://${username}: ${password}@${host}` };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
  ],
})
export class AppModule {}
