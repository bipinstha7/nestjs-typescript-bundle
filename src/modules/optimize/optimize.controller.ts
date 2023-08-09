import {
  Get,
  Res,
  Post,
  Param,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Queue } from 'bull';
import { Readable } from 'stream';
import { InjectQueue } from '@nestjs/bull';
import { Response, response } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('optimize')
export default class OptimizeController {
  constructor(@InjectQueue('image') private readonly imageQueue: Queue) {}

  @Post('image')
  @UseInterceptors(AnyFilesInterceptor())
  async processImage(@UploadedFile() files: Express.Multer.File[]) {
    const job = await this.imageQueue.add('optimize', { files });

    return { jobId: job.id };
  }

  @Get('image/:id')
  async getJobResult(@Res() res: Response, @Param('id') id: string) {
    const job = await this.imageQueue.getJob(id);

    if (!job) return res.sendStatus(404);

    const isCompleted = await job.isCompleted();

    if (!isCompleted) return res.sendStatus(202);

    const result = Buffer.from(job.returnvalue);
    const stream = Readable.from(result);

    stream.pipe(response);
  }
}
