import { Module } from '@nestjs/common';
import { CatalogRequestsService } from './catalog-requests.service';
import { CatalogRequestsController } from './catalog-requests.controller';

@Module({
  controllers: [CatalogRequestsController],
  providers: [CatalogRequestsService]
})
export class CatalogRequestsModule {}
