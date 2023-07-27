import { Controller } from '@nestjs/common';
import SubscriberService from './subscriber.service';
import { MessagePattern, EventPattern } from '@nestjs/microservices';

import CreateSubscriberDto from './createSubscriber.dto';

@Controller('subscribers')
export default class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @MessagePattern({ cmd: 'add-subscriber' })
  addSubscriber(subscriber: CreateSubscriberDto) {
    return this.subscriberService.addSubscriber(subscriber);
  }

  @MessagePattern({ cmd: 'get-all-subscribers' })
  getAllSubscribers() {
    return this.subscriberService.getAllSubscribers();
  }

  @EventPattern({ cmd: 'add-subscriber-event' })
  addSubscriberOnEvent(subscriber: CreateSubscriberDto) {
    return this.subscriberService.addSubscriber(subscriber);
  }
}
