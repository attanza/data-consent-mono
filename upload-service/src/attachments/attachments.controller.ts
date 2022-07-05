import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/shared/interfaces/file.interface';
import { responseSuccess } from 'src/utils/response-parser';
import { AddAttachmentDto } from './attachment.dto';
import { AttachmentsService } from './attachments.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly service: AttachmentsService) {}
  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: BufferedFile, @Body() { resourceId }: AddAttachmentDto) {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    await this.service.uploadImage(file, resourceId);
    return responseSuccess('File uploaded', undefined);
  }
}
