import {
  Req,
  Post,
  Body,
  UseGuards,
  Controller,
  UseInterceptors,
  BadRequestException,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import SmsService from './sms.service';
import AuthGuard from '../auth/middleware/auth.guard';
import { IRequestWithUser } from '../auth/interface/auth.interface';

@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
export default class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('initiate-verification')
  @UseGuards(AuthGuard)
  async initiatePhoneNumberVerification(@Req() req: IRequestWithUser) {
    if (req.user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number already confirmed');
    }

    await this.smsService.initiatePhoneNumberVerification(req.user.phoneNumber);
  }

  @Post('check-verification-code')
  @UseGuards(AuthGuard)
  async checkVerificationCode(
    @Req() req: IRequestWithUser,
    @Body() verificaitonData: { code: string },
  ) {
    if (req.user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number already confirmed');
    }

    await this.smsService.confirmPhoneNumber(
      req.user.id,
      req.user.phoneNumber,
      verificaitonData.code,
    );
  }
}
