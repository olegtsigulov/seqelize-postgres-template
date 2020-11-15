import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { ClientResponse } from '@sendgrid/client/src/response';

@Injectable()
export class MailerService {
  constructor(@InjectSendGrid() private readonly client: SendGridService) {}

  public async sendInviteEmail(email: string, password: string) : Promise<[ClientResponse, {}]|void> {
    return this.client.send({
      from: process.env.MAILER_FROM,
      to: email,
      html: `<b>✔ Welcome to App! Your temp password is ${password}. Click <a href="https://app.pp.ua">here</a> to open website. ✔</b>`,
      subject: 'authorisation invite! ✔',
      text: 'Welcome to App',
    });
  }

  public async sendForgotPassword(email: string, link: string): Promise<[ClientResponse, {}]|void> {
    return this.client.send({
      from: process.env.MAILER_FROM,
      to: email,
      html: `<b>✔ Кто-то хочет восстановить Ваш пароль, если это были Вы, перейдите по <a href=${link}>ссылке</a> ✔</b>`,
      subject: 'App восстановление пароля! ✔',
      text: 'App восстановление пароля!',
    });
  }
}
