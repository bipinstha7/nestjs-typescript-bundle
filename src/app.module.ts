import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import DatabaseModule from './db/db.module';
import PostModule from './modules/post/post.module';
import UserModule from './modules/user/user.module';

@Module({
  imports: [
    UserModule,
    PostModule,
    DatabaseModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object().keys({
        PORT: Joi.number().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
