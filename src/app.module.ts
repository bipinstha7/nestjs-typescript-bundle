import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import DatabaseModule from './db/db.module';
import PostModule from './modules/post/post.module';
import UserModule from './modules/user/user.module';
import AuthModule from './modules/auth/auth.module';
import EmailModule from './modules/email/email.module';
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
