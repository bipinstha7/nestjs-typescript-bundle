import { Req, Body, Controller, Post, UseGuards } from '@nestjs/common';

import EmailService from './email.service';
import AuthGuard from '../auth/middleware/auth.guard';
import ConfirmEmailDto from './dto/confirmEmail.dto';
import EmailScheduleDto from './dto/emailSchedule.dto';
import { IRequestWithUser } from '../auth/interface/auth.interface';

@Controller('email')
export default class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('schedule')
  @UseGuards(AuthGuard)
  scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    this.emailService.scheduleEmail(emailSchedule);
  }

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailService.decodeConfirmationToken(
      confirmationData.token,
    );

    await this.emailService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(AuthGuard)
  async resendConfirmationLink(@Req() request: IRequestWithUser) {
    await this.emailService.resendConfirmationLink(request.user.id);
  }
}
