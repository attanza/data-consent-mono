import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pagination } from 'mongoose-paginate-ts';
import { AuditTrailEvent } from '../events/audit-trail.event';
import { BaseService } from '../shared/services/base.service';
import { AuditTrail, AuditTrailDocument } from './audit-trail.schema';

@Injectable()
export class AuditTrailsService extends BaseService<AuditTrailDocument> {
  constructor(@InjectModel(AuditTrail.name) private model: Pagination<AuditTrailDocument>) {
    super(model);
  }

  async handleAuditTrail(data: AuditTrailEvent) {
    await this.create(data);
  }
}
