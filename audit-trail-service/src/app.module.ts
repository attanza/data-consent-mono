import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditTrailsModule } from './audit-trails/audit-trails.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuditTrailsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
