import { Module } from '@nestjs/common';
import { UserCatalogRequestsController } from './resources/catalog-requests/user-catalog-requests.controller';
import { UserCatalogRequestsService } from './resources/catalog-requests/user-catalog-requests.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserCatalogRequestItemsController } from './resources/catalog-request-items/user-catalog-request-items.controller';
import { UserCatalogRequestItemsService } from './resources/catalog-request-items/user-catalog-request-items.service';

@Module({
	controllers: [
		UsersController,
		UserCatalogRequestsController,
		UserCatalogRequestItemsController,
	],
	providers: [
		UsersService,
		UserCatalogRequestsService,
		UserCatalogRequestItemsService,
	],
	exports: [
		UsersService,
		UserCatalogRequestsService,
		UserCatalogRequestItemsService,
	],
})
export class UsersModule {}
