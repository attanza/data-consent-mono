import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import 'dotenv/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MinioModule.register({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    }),
    ClientsModule.register([
      {
        name: 'AUDIT_TRAIL_SERVICE',
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
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
