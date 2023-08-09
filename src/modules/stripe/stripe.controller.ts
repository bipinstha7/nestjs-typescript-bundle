import { Get, Req, Body, Controller, Post, UseGuards } from '@nestjs/common';

import StripeService from './stripe.service';
import CreateChargeDto from './dto/createCharge.dto';
import AuthGuard from '../auth/middleware/auth.guard';
import { IRequestWithUser } from '../auth/interface/auth.interface';
import AddCreditCardDto from './dto/addCreditCard.dto';

@Controller('charge')
export default class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCharge(
    @Body() charge: CreateChargeDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.stripeService.charge(
      charge.amount,
      charge.paymentMethodId,
      req.user.stripeCustomerId,
    );
  }

  @Post('credit-cards')
  @UseGuards(AuthGuard)
  async addCreditCard(
    @Body() creditCard: AddCreditCardDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.stripeService.attachCreditCard(
      creditCard.paymentMethodId,
      req.user.stripeCustomerId,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getCreditCards(@Req() req: IRequestWithUser) {
    return this.stripeService.listCreditCards(req.user.stripeCustomerId);
  }
}
