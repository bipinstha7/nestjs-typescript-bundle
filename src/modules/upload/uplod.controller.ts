import {
  Res,
  Get,
  Param,
  Controller,
  ParseIntPipe,
  StreamableFile,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Readable } from 'stream';
import { Response } from 'express';

import UploadService from './upload.service';

@Controller('database-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get(':id')
  async getDatabaseFileById(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const file = await this.uploadService.getFileById(id);

    const stream = Readable.from(file.data);
    // stream.pipe(response);

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image',
    });

    return new StreamableFile(stream);
  }
}
