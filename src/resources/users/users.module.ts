import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserCatalogRequestsController } from './resources/catalog-requests/user-catalog-requests.controller';
import { UserCatalogRequestsService } from './resources/catalog-requests/user-catalog-requests.service';

@Module({
	controllers: [UsersController, UserCatalogRequestsController],
	providers: [UsersService, UserCatalogRequestsService],
	exports: [UsersService, UserCatalogRequestsService],
})
export class UsersModule {}
