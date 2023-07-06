import { Module } from '@nestjs/common';
import { CatalogEntriesService } from './catalog-entries.service';
import { CatalogEntriesController } from './catalog-entries.controller';

@Module({
  controllers: [CatalogEntriesController],
  providers: [CatalogEntriesService]
})
export class CatalogEntriesModule {}
