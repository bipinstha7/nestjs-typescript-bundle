import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Subscriber from './subscriber.entity';
import SubscriberService from './subscriber.service';
import SubscriberController from './subscriber.cotroller';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  // controllers: [SubscriberController],
  // providers: [SubscriberService],
  controllers: [SubscriberService],
})
export default class SubscriberModule {}
