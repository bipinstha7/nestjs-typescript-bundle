import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { authenticator } from 'otplib';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import User from '../../user/user.entity';
import UserService from '../../user/user.service';

@Injectable()
export default class TwoFactorAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async generateTwoFactorAuthSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTH_APP_NAME'),
      secret,
    );

    await this.userService.setTwoFactorAuthSecret(secret, user.id);

    return { secret, otpAuthUrl };
  }

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  async validate(code: string, user: User) {
    return authenticator.verify({
      token: code,
      secret: user.twoFactorAuthSecret,
    });
  }
}
