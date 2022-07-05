import { Global, Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
})
export class HttpClientModule {}
