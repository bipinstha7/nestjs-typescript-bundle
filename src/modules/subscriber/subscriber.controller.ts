import {
  Get,
  Inject,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import AuthGuard from '../auth/middleware/auth.guard';
import CreateSubscriberDto from './dto/createSubscriber.dto';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscriberController {
  constructor(
    @Inject('SUBSCRIBER_SERVICE') private subscriberService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getSubscribers() {
    return this.subscriberService.send({ cmd: 'get-all-subscribers' }, '');
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscriberService.send({ cmd: 'add-subscriber' }, subscriber);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPostOnEvent(@Body() subscriber: CreateSubscriberDto) {
    return this.subscriberService.emit(
      { cmd: 'add-subscriber-event' },
      subscriber,
    );
  }
}
