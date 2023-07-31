import {
  Get,
  Inject,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy, ClientGrpc } from '@nestjs/microservices';

import AuthGuard from '../auth/middleware/auth.guard';
import CreateSubscriberDto from './dto/createSubscriber.dto';
import ISubscriberService from './interface/subscriber.service.interface';

// @Controller('subscribers')
// @UseInterceptors(ClassSerializerInterceptor)
// export default class SubscriberController {
//   constructor(
//     @Inject('SUBSCRIBER_SERVICE') private subscriberService: ClientProxy,
//   ) {}

//   @Get()
//   @UseGuards(AuthGuard)
//   async getSubscribers() {
//     return this.subscriberService.send({ cmd: 'get-all-subscribers' }, '');
//   }

//   @Post()
//   @UseGuards(AuthGuard)
//   async createPost(@Body() subscriber: CreateSubscriberDto) {
//     return this.subscriberService.send({ cmd: 'add-subscriber' }, subscriber);
//   }

//   @Post()
//   @UseGuards(AuthGuard)
//   async createPostOnEvent(@Body() subscriber: CreateSubscriberDto) {
//     return this.subscriberService.emit(
//       { cmd: 'add-subscriber-event' },
//       subscriber,
//     );
//   }
// }

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscriberController implements OnModuleInit {
  private subscriberService: ISubscriberService;
  constructor(@Inject('SUBSCRIBER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.subscriberService =
      this.client.getService<ISubscriberService>('SubscriberService');
  }

  @Get()
  @UseGuards(AuthGuard)
  async getSubscribers() {
    return this.subscriberService.getAllSubscribers({});
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscriberService.addSubscriber(subscriber);
  }
}
