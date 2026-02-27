import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailNotificationDTO } from 'src/shared/dto/queue.dto';

@Injectable()
export class RabbitProducerService {
  private exchange: string;
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {
    this.exchange =
      this.configService.get('RMQ_EXCHANGE') || 'project.exam.hub';
  }

  async publishMessageToEmailQueue(message: EmailNotificationDTO) {
    await this.amqpConnection.publish(
      this.exchange,
      'user.email.notification',
      message,
    );
  }
}
