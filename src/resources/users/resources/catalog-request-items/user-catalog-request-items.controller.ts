import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { Auth } from '../../../../auth/decorators/auth.decorator';
import { CreateCatalogRequestItemDto } from './dto/create-catalog-request-item.dto';
import {
	CatalogRequestItemEntity,
	CatalogRequestItemsModel,
} from './entities/catalog-request-item.entity';
import { UpdateCatalogRequestItemDto } from './dto/update-catalog-request-item.dto';
import { UserCatalogRequestItemsService } from './user-catalog-request-items.service';

@ApiTags('users-catalog-requests-items')
@Controller(':uid/catalog-requests/:rid/items')
@Auth()
export class UserCatalogRequestItemsController {
	constructor(
		private readonly catalogRequestsService: UserCatalogRequestItemsService,
	) {}

	/**
	 * Authorize User
	 * validate if there's an available request to add the items to (if not then create one)
	 * Add Items to the Request
	 */
	@ApiOperation({ summary: 'Add items to a catalog request' })
	@ApiParam({ name: 'rid', type: 'string', description: 'Request Id' })
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@Post()
	async addItemsToRequest(
		@Param('uid') uid: string,
		@Param('rid') requestId: string,
		@Body() createCatalogRequestItemDto: CreateCatalogRequestItemDto,
	): Promise<CatalogRequestItemsModel> {
		return this.catalogRequestsService.addItemsToRequest(
			requestId,
			createCatalogRequestItemDto,
		);
	}

	/**
	 * Authorize User
	 * remove items from request
	 */
	@ApiOperation({ summary: 'Remove items from a catalog request' })
	@ApiParam({ name: 'rid', description: 'Catalog request ID' })
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@ApiResponse({
		status: 200,
		description: 'Items removed successfully',
		type: CatalogRequestItemEntity,
	})
	@ApiResponse({ status: 404, description: 'Catalog request not found' })
	@Delete()
	async clearItemsFromRequest(
		@Param('uid') uid: string,
		@Param('rid') requestId: string,
	): Promise<CatalogRequestItemsModel> {
		return this.catalogRequestsService.clearItemsFromRequest(requestId);
	}

	/**
	 * Authorize User
	 * remove items from request
	 */
	@ApiOperation({ summary: 'Remove items from a catalog request' })
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@ApiParam({ name: 'rid', description: 'Catalog request ID' })
	@ApiParam({ name: 'itemId', description: 'ID of the item to delete' })
	@ApiResponse({
		status: 200,
		description: 'Items removed successfully',
		type: CatalogRequestItemEntity,
	})
	@ApiResponse({ status: 404, description: 'Catalog request not found' })
	@Delete(':itemId')
	async removeItemFromRequest(
		@Param('uid') uid: string,
		@Param('rid') requestId: string,
		@Param('itemId') itemId: string,
	): Promise<CatalogRequestItemsModel> {
		return this.catalogRequestsService.removeItemFromRequest(
			requestId,
			itemId,
		);
	}

	/**
	 * Edit Items Quantity
	 */
	@ApiOperation({
		summary: 'Update quantity of a specific item in a catalog request',
	})
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@ApiParam({ name: 'rid', description: 'Catalog request ID' })
	@ApiParam({ name: 'itemId', description: 'ID of the item to update' })
	@ApiResponse({
		status: 200,
		description: 'Item quantity updated successfully',
		type: CatalogRequestItemEntity,
	})
	@ApiResponse({
		status: 404,
		description: 'Catalog request or item not found',
	})
	@Patch(':itemId')
	async updateItemQuantity(
		@Param('uid') uid: string,
		@Param('rid') requestId: string,
		@Param('itemId') itemId: string,
		@Body() updateItemDto: UpdateCatalogRequestItemDto,
	): Promise<CatalogRequestItemsModel> {
		return this.catalogRequestsService.updateItemQuantity(
			requestId,
			itemId,
			updateItemDto,
		);
	}
}
