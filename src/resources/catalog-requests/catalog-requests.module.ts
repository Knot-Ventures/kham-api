import { Module } from '@nestjs/common';
import { DrizzleService } from '../../drizzle/drizzle.service';
import { CatalogRequestsController } from './catalog-requests.controller';
import { CatalogRequestsService } from './catalog-requests.service';

@Module({
	controllers: [CatalogRequestsController],
	providers: [CatalogRequestsService, DrizzleService],
})
export class CatalogRequestsModule {}
