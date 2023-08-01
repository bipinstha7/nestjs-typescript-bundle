import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import EmailService from './email.service';
import AuthGuard from '../auth/middleware/auth.guard';
import EmailScheduleDto from './dto/emailSchedule.dto';

@Controller('email')
export default class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('schedule')
  @UseGuards(AuthGuard)
  scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    this.emailService.scheduleEmail(emailSchedule);
  }
}
