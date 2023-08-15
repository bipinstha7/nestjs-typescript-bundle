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
import { join } from 'path';
import { Readable } from 'stream';
import { Response } from 'express';
import { createReadStream } from 'fs';

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

  @Get(':id')
  async getLocalFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.uploadService.getLocalFileById(id);

    const stream = createReadStream(join(process.cwd(), file.path));

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype,
    });
    return new StreamableFile(stream);
  }
}
