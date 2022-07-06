import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pagination } from 'mongoose-paginate-ts';
import { BaseService } from '../shared/services/base.service';
import { Source, SourceDocument } from './source.schema';
import crypto from 'crypto';
import { isMongoId } from 'class-validator';
@Injectable()
export class SourcesService extends BaseService<SourceDocument> {
  constructor(@InjectModel(Source.name) private model: Pagination<SourceDocument>) {
    super(model);
  }

  generateSecret() {
    const clientId = crypto.randomBytes(16).toString('hex');
    const clientSecret = crypto.randomBytes(32).toString('hex');
    return { clientId, clientSecret };
  }

  async findInIds(ids: string[], select: string) {
    return this.model.find({ _id: { $in: ids } }).select(select);
  }

  async getSource(id: string) {
    let found: any;
    if (isMongoId(id)) {
      found = await this.model.findById(id).exec();
    } else {
      found = await this.model.findOne({ clientId: id }).exec();
    }
    if (!found) {
      throw new BadRequestException(`${this.model.modelName} not found`);
    }
    return found;
  }
}
