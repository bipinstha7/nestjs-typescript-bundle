import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from './user.entity';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  // add the UsersService to the exports array of the @Module decorator so that it is visible outside this module (we'll soon use it in our AuthService)
})
export default class UserModule {}
