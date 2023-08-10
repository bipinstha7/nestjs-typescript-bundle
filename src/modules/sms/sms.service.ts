import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { Injectable, BadRequestException } from '@nestjs/common';

import UserService from '../user/user.service';
import { ITwilioConfig } from '../../config/config.interface';

@Injectable()
export default class SmsService {
  private twilioClient: Twilio;

  constructor(
    private readonly configService: ConfigService<ITwilioConfig>,
    private readonly userService: UserService,
  ) {
    const accountServiceId = configService.get('TWILIO_ACCOUNT_SERVICE_ID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountServiceId, authToken);
  }

  initiatePhoneNumberVerification(phoneNumber: string) {
    const verificationServiceId = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_ID',
    );

    return this.twilioClient.verify.v2
      .services(verificationServiceId)
      .verifications.create({ to: phoneNumber, channel: 'sms', locale: 'en' });
  }

  async confirmPhoneNumber(
    userId: number,
    phoneNumber: string,
    verificationCode: string,
  ) {
    const verificationServiceId = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_ID',
    );

    const result = await this.twilioClient.verify.v2
      .services(verificationServiceId)
      .verificationChecks.create({ to: phoneNumber, code: verificationCode });

    if (!result.valid || result.status !== 'approved') {
      throw new BadRequestException('Wrong code provided');
    }

    await this.userService.markPhoneNumberAsConfirmed(userId);
  }
}
