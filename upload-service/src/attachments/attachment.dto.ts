import { IsNotEmpty, IsString } from 'class-validator';

export class AddAttachmentDto {
  @IsNotEmpty()
  @IsString()
  resourceId: string;
}
