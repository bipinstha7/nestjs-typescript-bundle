import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import PublicFile from './pulicFile.entity';
import UploadService from './upload.service';
import PrivateFile from './privateFile.entity';
import UploadController from './uplod.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile, PrivateFile]), ConfigModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
