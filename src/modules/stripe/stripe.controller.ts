import { Req, Body, Controller, Post, UseGuards } from '@nestjs/common';

import StripeService from './stripe.service';
import CreateChargeDto from './dto/createCharge.dto';
import AuthGuard from '../auth/middleware/auth.guard';
import { IRequestWithUser } from '../auth/interface/auth.interface';

@Controller('charge')
export default class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCharge(
    @Body() charge: CreateChargeDto,
    @Req() req: IRequestWithUser,
  ) {
    await this.stripeService.charge(
      charge.amount,
      charge.paymentMethodId,
      req.user.stripeCustomerId,
    );
  }
}
