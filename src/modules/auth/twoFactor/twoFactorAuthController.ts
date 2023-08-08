import {
  Req,
  Res,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Controller,
  UseInterceptors,
  UnauthorizedException,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Response } from 'express';

import AuthService from '../auth.service';
import AuthGuard from '../middleware/auth.guard';
import constants from '../../../utils/constants';
import UserService from 'src/modules/user/user.service';
import TwoFactorAuthService from './twoFactorAuth.service';
import { IRequestWithUser } from '../interface/auth.interface';
import { TwoFactorAuthCodeDto } from './dto/twoFactorAuth.dto';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export default class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('generate')
  @UseGuards(AuthGuard)
  async register(@Res() response: Response, @Req() request: IRequestWithUser) {
    const { otpAuthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(request.user);

    return this.twoFactorAuthService.pipeQrCodeStream(response, otpAuthUrl);
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async turnOnTwoFactorAuth(
    @Req() request: IRequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = await this.twoFactorAuthService.validate(
      twoFactorAuthCode,
      request.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid auth code');
    }

    await this.userService.turnOnTwoFactorAuth(request.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async authenticate(
    @Req() request: IRequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = await this.twoFactorAuthService.validate(
      twoFactorAuthCode,
      request.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid auth code');
    }

    const accessTokenCookie = await this.authService.getCookieWithJwtToken(
      request.user.id,
      constants.TWO_FACTOR_AUTH_TOKEN_KEY,
    );
    await this.userService.addTokenKey(
      request.user.id,
      constants.TWO_FACTOR_AUTH_TOKEN_KEY,
    );

    request.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return request.user;
  }
}
