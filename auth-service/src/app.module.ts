import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditTrailsModule } from './audit-trails/audit-trails.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, AuditTrailsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
