import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditTrailDocument = AuditTrail & Document;

@Schema({
  timestamps: true,
})
export class AuditTrail {
  @Prop()
  ip: string;

  @Prop()
  userId: string;

  @Prop()
  email: string;

  @Prop()
  resource: string;

  @Prop()
  resourceId: string;

  @Prop()
  action: string;

  @Prop()
  prevData: string;

  @Prop()
  data: string;
}

export const AuditTrailSchema = SchemaFactory.createForClass(AuditTrail);
