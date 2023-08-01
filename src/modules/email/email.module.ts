import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import EmailService from './email.service';
import AuthModule from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  exports: [EmailService],
  providers: [EmailService],
})
export default class EmailModule {}
