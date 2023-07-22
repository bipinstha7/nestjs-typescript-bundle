import {
  Res,
  Req,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import AuthGuard from './auth.guard';
import AuthService from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { IRequestWithUser } from './auth.interface';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  // Here we use  @HttpCode(200) because NestJS responds with 201 Created for POST requests by default
  // @HttpCode(HttpStatus.OK)
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginData: LoginDto, @Res() res: Response) {
    const { email, password } = loginData;
    const { user, cookie } = await this.authService.login(email, password);

    res.setHeader('Set-Cookie', cookie);
    return res.send(user);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Req() req: IRequestWithUser, @Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.logout(req.user.id));
    return res.sendStatus(HttpStatus.OK);
  }
}
