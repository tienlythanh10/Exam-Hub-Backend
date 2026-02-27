import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MailService } from 'src/modules/mail/mail.service';
import { EmailNotificationDTO } from 'src/shared/dto/queue.dto';

dotenv.config({
  path: '.env.local',
});

@Injectable()
export class RabbitConsumerService {
  constructor(private readonly mailService: MailService) {}

  @RabbitSubscribe({
    exchange: process.env.RMQ_EXCHANGE,
    routingKey: 'user.email.notification',
    queue: 'q.user.email_notification',
  })
  public async handleEmailQueue(message: EmailNotificationDTO) {
    console.log(message);
  }
}
