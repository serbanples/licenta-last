import { LoggerService } from '@app/logger';
import { MailJobData, MailTypeEnum } from '@app/types';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';

/**
 * Mail Service class used to send emails.
 */
@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService, private readonly logger: LoggerService) {}

  async sendMail(data: MailJobData) {
    switch(data.mailType) {
        case MailTypeEnum.VERIFY_ACCOUNT: 
            await this.sendVerificationEmail(data.to, data.payload.verificationToken);
            break;
        case MailTypeEnum.RESET_PASSWORD:
            await this.sendResetPasswordEmail(data.to, data.payload.resetToken);
            break;
    }
  }

  /**
   * Method used to send verification emails on account creation.
   * 
   * @param {string} to mail recipient
   * @param {string} verificationToken verification token for the user.
   * @returns {Promise<void>} sends an email.
   */
  private async sendVerificationEmail(to: string, verificationToken: string): Promise<void> {
    const verificationUrl = `http://localhost:3000/auth/verify-account?verificationToken=${verificationToken}`;
    const html = '<h1>Welcome to Our Platform!</h1><p>To verify your account, click on the link below:</p><a href="{{verificationUrl}}">Verify Account</a>';

    const template = handlebars.compile(html);
    const replacements = {
      verificationUrl,
    }

    await this.mailer.sendMail({
      from: '"Auth" <auth@classcloud.com>',
      to,
      subject: 'Verify your account',
      html: template(replacements),
    })

    this.logger.log('Mail sent', { to });
  }

  /**
   * Method used to send verification emails on account creation.
   * 
   * @param {string} to mail recipient
   * @param {string} resetToken verification token for the user.
   * @returns {Promise<void>} sends an email.
   */
  private async sendResetPasswordEmail(to: string, resetToken: string): Promise<void> {
    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?resetToken=${resetToken}`;
    const html = '<p>To reset your password, click on the link below:</p><a href="{{resetPasswordUrl}}">Reset Password</a>';

    const template = handlebars.compile(html);
    const replacements = {
      resetPasswordUrl,
    }

    await this.mailer.sendMail({
      from: '"Auth" <auth@classcloud.com>',
      to,
      subject: 'Reset your password',
      html: template(replacements),
    })

    this.logger.log('Mail sent', { to });
  }

}
