import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Roles } from '../shared/guards/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';
import { EUserRole } from '../shared/interfaces/user-role.enum';
import { MongoIdPipe } from '../shared/pipes/mongoId.pipe';
import { ResourcePaginationPipe } from '../shared/pipes/resource-pagination.pipe';
import { responseCollection, responseDetail } from '../utils/response-parser';
import { AuditTrailsService } from './audit-trails.service';

@UseGuards(RolesGuard)
@Controller('audit-trails')
export class AuditTrailsController {
  private resource = 'AuditTrail';
  constructor(private readonly service: AuditTrailsService) {}

  @Get()
  @Roles(EUserRole.ADMIN)
  async paginate(@Query() query: ResourcePaginationPipe) {
    const result = await this.service.paginate(query, ['email', 'resource', 'action']);
    return responseCollection(this.resource, result);
  }

  @Get(':id')
  @Roles(EUserRole.ADMIN)
  async get(@Param() { id }: MongoIdPipe) {
    const result = await this.service.getById(id);
    return responseDetail(this.resource, result);
  }

  @EventPattern('audit_trail')
  handleOrderCreated(data: any) {
    this.service.handleAuditTrail(data.value);
  }
}
