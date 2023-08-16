import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import User from './user.entity';
import UserService from './user.service';
import UserController from './user.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    JwtModule,
    UploadModule,
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    /* incase we need upload module in usermodule , we prevent circular dependency using forwardRef*/
    // forwardRef(() => UploadModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  // add the UsersService to the exports array of the @Module decorator so that it is visible outside this module (we use it in our AuthService)
})
export default class UserModule {}
