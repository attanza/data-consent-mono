import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AddAttachmentEvent } from 'src/events/add-attachment.event';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/shared/interfaces/file.interface';

@Injectable()
export class AttachmentsService {
  constructor(
    private minioClientService: MinioClientService,
    @Inject('ATTACHMENT_SERVICE') private readonly attachmentCLient: ClientKafka,
  ) {}

  async uploadImage(file: BufferedFile, resourceId: string) {
    const fileName = await this.minioClientService.upload(file);
    this.attachmentCLient.emit(
      'consent_add_attachment',
      new AddAttachmentEvent(resourceId, fileName),
    );
  }
}
