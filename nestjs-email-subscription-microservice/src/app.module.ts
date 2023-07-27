import { Module } from '@nestjs/common';
import SubscriberModule from './subscriber.module';

@Module({
  imports: [SubscriberModule],
})
export class AppModule {}
