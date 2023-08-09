import { join } from 'path';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import OptimizeController from './optimize.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image',
      processors: [
        { name: 'optimize', path: join(__dirname, 'image.processor.js') },
      ],
    }),
  ],
  controllers: [OptimizeController],
})
export default class OptimizeModule {}
