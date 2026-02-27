import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitProducerService } from './services/producer.service';
import { RabbitConsumerService } from './services/consumer.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: process.env.RMQ_EXCHANGE || 'project.exam.hub',
          type: 'direct',
        },
      ],
      uri: `amqps://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}/${process.env.RMQ_USER}`,
      connectionInitOptions: { wait: false },
      queues: [
        {
          name: 'q.user.email_notification',
          exchange: process.env.RMQ_EXCHANGE,
          createQueueIfNotExists: true,
          routingKey: 'user.email.notification',
          options: {
            noAck: false,
            durable: true,
          },
        },
      ],
    }),
    CustomRabbitModule,
  ],
  providers: [RabbitProducerService, RabbitConsumerService, MailService],
  exports: [RabbitMQModule],
})
export class CustomRabbitModule {}
