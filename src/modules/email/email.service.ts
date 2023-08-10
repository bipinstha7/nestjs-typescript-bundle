import { CronJob } from 'cron';
import { JwtService } from '@nestjs/jwt';
import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Injectable, BadRequestException } from '@nestjs/common';

import UserService from '../user/user.service';
import EmailScheduleDto from './dto/emailSchedule.dto';
import { IEmailConfig, IJWTConfig } from '../../config/config.interface';

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;

  constructor(
    private readonly configService: ConfigService<IEmailConfig & IJWTConfig>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }

  scheduleEmail(emailSchedule: EmailScheduleDto) {
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      this.sendMail({
        to: emailSchedule.recipient,
        text: emailSchedule.content,
        subject: emailSchedule.subject,
      });
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job,
    );

    job.start();
  }

  cancelAllScheduledEmails() {
    this.schedulerRegistry.getCronJobs().forEach(job => {
      job.stop();
    });
  }

  sendVerificationLink(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET'),
      expiresIn: this.configService.get(
        'JWT_EMAIL_VERIFICATION_EXPIRATION_TIME',
      ),
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const text = `Welcome to the application. To confirm the email, click here: ${url}`;

    return this.sendMail({ to: email, subject: 'Email Confirmation', text });
  }

  async confirmEmail(email: string) {
    const user = await this.userService.getByEmail(email);

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.userService.markEmailAsConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async resendConfirmationLink(userId: number) {
    const user = await this.userService.findBy(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }
}
