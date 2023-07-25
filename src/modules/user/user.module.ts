import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from './entity/user.entity';
import UserService from './user.service';
import UserController from './user.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    JwtModule,
    UploadModule,
    ConfigModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  // add the UsersService to the exports array of the @Module decorator so that it is visible outside this module (we use it in our AuthService)
})
export default class UserModule {}
