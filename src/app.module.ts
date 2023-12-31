import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import DatabaseModule from './db/db.module';
import PostModule from './modules/post/post.module';
import UserModule from './modules/user/user.module';
import AuthModule from './modules/auth/auth.module';
import EmailModule from './modules/email/email.module';
import LogsMiddleware from './middleware/logs.middleware';
import ConfigValidation from './config/config.validation';
import HealthModule from './modules/health/health.module';
import CommentModule from './modules/comment/comment.module';
import CategoryModule from './modules/category/category.module';
import { ExceptionsLoggerFilter } from './utils/exceptionsLogger.filter';
import { IMongoConfig, IRedisConfig } from './config/config.interface';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    EmailModule,
    HealthModule,
    CommentModule,
    DatabaseModule,
    CategoryModule,
    /* The ScheduleModule.forRoot method initializes the scheduler. It also registers all the cron jobs we define declaratively across our application. */
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ validationSchema: ConfigValidation() }),
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
    //     autoSchemaFile: join(process.cwd(), '/src/schema.gql'),
    //   }),
    // }),
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
