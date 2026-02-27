import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private mailClient: SESClient;

  constructor(private readonly configService: ConfigService) {
    this.mailClient = new SESClient({
      credentials: {
        accessKeyId: this.configService.get('SMTP_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('SMTP_ACCESS_SECRET') || '',
      },
      region: this.configService.get('SES_REGION'),
    });
  }

  createSendMailCommand(receiver: string, subject: string, body: string) {
    return new SendEmailCommand({
      Destination: {
        ToAddresses: [receiver],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: this.configService.get('SES_SENDER'),
    });
  }

  async sendMail(receiver: string, subject: string, body: string) {
    let command = this.createSendMailCommand(receiver, subject, body);
    return await this.mailClient.send(command);
  }
}
