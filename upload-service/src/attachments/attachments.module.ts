import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MinioClientModule,
    ClientsModule.register([
      {
        name: 'ATTACHMENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'attachment',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'attachment-consumer',
          },
        },
      },
    ]),
  ],
  providers: [AttachmentsService],
  exports: [AttachmentsService],
  controllers: [AttachmentsController],
})
export class AttachmentsModule {}
