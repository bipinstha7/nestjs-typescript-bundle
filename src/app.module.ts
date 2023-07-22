import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import DatabaseModule from './db/db.module';
import PostModule from './modules/post/post.module';
import UserModule from './modules/user/user.module';
import AuthModule from './modules/auth/auth.module';
import ConfigValidation from './config/config.validation';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    DatabaseModule,
    ConfigModule.forRoot({ validationSchema: ConfigValidation() }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
