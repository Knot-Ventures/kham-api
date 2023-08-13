import { Module } from '@nestjs/common';
import { DrizzleService } from '../../drizzle/drizzle.service';
import { CatalogEntriesController } from './catalog-entries.controller';
import { CatalogEntriesService } from './catalog-entries.service';

@Module({
	controllers: [CatalogEntriesController],
	providers: [CatalogEntriesService],
})
export class CatalogEntriesModule {}
