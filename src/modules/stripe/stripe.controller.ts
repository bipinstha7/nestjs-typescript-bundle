import {
  Get,
  Req,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Controller,
} from '@nestjs/common';

import StripeService from './stripe.service';
import CreateChargeDto from './dto/createCharge.dto';
import AuthGuard from '../auth/middleware/auth.guard';
import AddCreditCardDto from './dto/addCreditCard.dto';
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

  @Post('default')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async setDefaultCard(
    @Body() creditCard: AddCreditCardDto,
    @Req() request: IRequestWithUser,
  ) {
    await this.stripeService.setDefaultCreditCard(
      creditCard.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }

  @Post('subscriptions/monthly')
  @UseGuards(AuthGuard)
  async createMonthlySubscription(@Req() req: IRequestWithUser) {
    return this.stripeService.createMonthlySubscription(
      req.user.stripeCustomerId,
    );
  }

  @Get('subscriptions/monthly')
  @UseGuards(AuthGuard)
  async getMonthlySubscription(@Req() req: IRequestWithUser) {
    return this.stripeService.getMonthlySubscription(req.user.stripeCustomerId);
  }
}
