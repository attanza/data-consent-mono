import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from 'src/shared/interfaces/file.interface';
import * as crypto from 'crypto';
@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioService');
  }

  private readonly logger: Logger;
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;

  public get client() {
    return this.minio.client;
  }

  public async upload(file: BufferedFile, bucketName: string = this.bucketName) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('File type not supported', HttpStatus.BAD_REQUEST);
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto.createHash('md5').update(timestamp).digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
    };

    // We need to append the extension at the end otherwise Minio will save it as a generic file
    const fileName = hashedFileName + extension;

    this.client.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
      function (err, res) {
        if (err) {
          throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
        }
      },
    );

    return fileName;
  }

  async delete(objetName: string, bucketName: string = this.bucketName) {
    try {
      await this.client.removeObject(bucketName, objetName);
    } catch (error) {
      throw new HttpException('An error occured when deleting!', HttpStatus.BAD_REQUEST);
    }
  }
}
