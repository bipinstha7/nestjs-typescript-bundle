import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import StripeEvent from '../stripe.entity';
import UserService from '../../user/user.service';
import { PostgresErrorCode } from '../../../db/postgreErrorCodes.enum';

@Injectable()
export default class StripeWebhookService {
  constructor(
    @InjectRepository(StripeEvent)
    private eventRepository: Repository<StripeEvent>,
    private readonly userService: UserService,
  ) {}

  createEvent(id: string) {
    return this.eventRepository.insert({ id });
  }

  async processSubscriptionUpdate(event: Stripe.Event) {
    try {
      await this.createEvent(event.id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('This event was already processed');
      }
    }

    const data = event.data.object as Stripe.Subscription;

    const customerId: string = data.customer as string;
    const subscriptionStatus = data.status;

    await this.userService.updateMonthlySubscriptionStatus(
      customerId,
      subscriptionStatus,
    );
  }
}
