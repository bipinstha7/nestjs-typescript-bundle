import {
  Req,
  Post,
  Headers,
  Controller,
  BadRequestException,
} from '@nestjs/common';

import StripeService from '../stripe.service';
import StripeWebhookService from './stripeWebhook.service';
import IRequestWithRawBody from './requestWithRawBody.interface';

@Controller('webhook')
export default class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly stripeWebhookServie: StripeWebhookService,
  ) {}

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() req: IRequestWithRawBody,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      req.rawBody,
    );

    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.created'
    ) {
      return this.stripeWebhookServie.processSubscriptionUpdate(event);
    }
  }
}
