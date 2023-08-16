import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import PublicFile from './pulicFile.entity';
import UserModule from '../user/user.module';
import UploadService from './upload.service';
import PrivateFile from './privateFile.entity';
import UploadController from './uplod.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicFile, PrivateFile]),
    ConfigModule,
    /* incase we need usermodule in upload module, we prevent circular dependency using forwardRef*/
    forwardRef(() => UserModule),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
