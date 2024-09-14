import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/users.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordEmail(user: User, token: string) {
    const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: process.env.EMAIL_FROM,
      subject: 'Reset password',
      template: 'reset-password',
      context: {
        url,
      },
    });
  }

  async sendSetPasswordRequestEmail(user: User, token: string) {
    const url = `${process.env.CLIENT_URL}/set-password?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: process.env.EMAIL_FROM,
      subject: 'Welcome to the platform',
      template: 'set-password',
      context: {
        url,
      },
    });
  }
}
