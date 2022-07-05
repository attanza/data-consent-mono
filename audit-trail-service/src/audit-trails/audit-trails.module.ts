import { Module } from '@nestjs/common';
import { AuditTrailsService } from './audit-trails.service';
import { AuditTrailsController } from './audit-trails.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditTrail, AuditTrailSchema } from './audit-trail.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AuditTrail.name, schema: AuditTrailSchema }])],
  providers: [AuditTrailsService],
  controllers: [AuditTrailsController],
})
export class AuditTrailsModule {}
