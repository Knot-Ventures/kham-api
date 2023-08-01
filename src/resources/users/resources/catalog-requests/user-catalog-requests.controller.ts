import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { CreateCatalogRequestItemDto } from './dto/create-catalog-request-item.dto';
import { CreateCatalogRequestDto } from './dto/create-catalog-request.dto';
import { ItemsDto } from './dto/items.dto';
import { SubmitCatalogRequestDto } from './dto/submit-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/update-catalog-request.dto';
import { UpdateItemCountDto } from './dto/update-item-count.dto';
import { CatalogRequestItemsModel } from './entities/catalog-request-item.entity';
import {
	CatalogRequestEntity,
	CatalogRequestModel,
} from './entities/catalog-request.entity';
import { UserCatalogRequestsService } from './user-catalog-requests.service';

@ApiTags('users-catalog-requests')
@Controller(':uid/catalog-requests')
export class UserCatalogRequestsController {
	constructor(
		private readonly catalogRequestsService: UserCatalogRequestsService,
	) {}

	/**
	 * Create A catalog request ({status: 'parked'}) to allow the user to add items
	 */
	@Post()
	create(
		@Body() createCatalogRequestDto: CreateCatalogRequestDto,
	): Promise<CatalogRequestModel> {
		return this.catalogRequestsService.create(createCatalogRequestDto);
	}

	/**
	 * Submit a catalog request for the user and notify Kham Sales Team
	 */
	@Patch()
	submit(
		@Body() submitCatalogRequestDto: SubmitCatalogRequestDto,
	): Promise<CatalogRequestModel> {
		return this.catalogRequestsService.submit(submitCatalogRequestDto);
	}

	/**
	 * get All the catalog requests for the current user
	 * add select array to select columns from table
	 * implement pagination
	 */
	@ApiOperation({ summary: 'Get all catalog requests' })
	@ApiOkResponse({ type: CatalogRequestEntity, isArray: true })
	@ApiQuery({ name: 'page', required: false, type: Number })
	@ApiQuery({ name: 'limit', required: false, type: Number })
	@Get()
	async findAll(
		@Query('page') page = 1,
		@Query('limit') limit = 10,
	): Promise<CatalogRequestModel[]> {
		return this.catalogRequestsService.findAll(page, limit);
	}

	/**
	 * get the latest request that has not been pushed (ie; current cart)
	 */

	/**
	 * get a specific request
	 * with Items and Contact Info
	 */
	@ApiOperation({ summary: 'Get a catalog request by ID' })
	@ApiOkResponse({ type: CatalogRequestEntity })
	@ApiParam({ name: 'id', type: String })
	@Get(':id')
	async findOne(@Param('id') id: string): Promise<CatalogRequestEntity> {
		return this.catalogRequestsService.findOne(id);
	}

	/**
	 * update specific properties
	 * Not all properties will be allowed to change TBD
	 */
	@ApiOperation({ summary: 'Update a catalog request by ID' })
	@ApiBody({ type: UpdateCatalogRequestDto })
	@ApiOkResponse({ type: CatalogRequestEntity })
	@ApiParam({ name: 'id', type: String })
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateCatalogRequestDto: UpdateCatalogRequestDto,
	): Promise<CatalogRequestModel> {
		return this.catalogRequestsService.update(id, updateCatalogRequestDto);
	}

	/**
	 * validate if there's an available request to add the items to (if not then create one)
	 * Add Items to the Request
	 */
	//Add Items to the Request
	@ApiOperation({ summary: 'Add items to a catalog request' })
	@ApiParam({ name: 'id', description: 'Catalog request ID' })
	@Post(':id/items')
	async addItemsToRequest(
		@Param('id') requestId: string,
		@Body() createCatalogRequestItemDto: CreateCatalogRequestItemDto,
	): Promise<CatalogRequestItemsModel> {
		return this.catalogRequestsService.addItemsToRequest(
			requestId,
			createCatalogRequestItemDto,
		);
	} //need to test it after create catalog entry

	//add items to otherItems in catalogRequestTable
	@Post(':id/otherItems')
	addItems(
		@Param('id') requestId: string,
		@Body() addItemsDto: ItemsDto,
	): Promise<CatalogRequestModel> {
		return this.catalogRequestsService.addItems(requestId, addItemsDto);
	}

	/**
	 * remove items from request
	 */
	@Delete(':id/items')
	async removeItems(
		@Param('id') requestId: string,
		@Body() removeItemsDto: ItemsDto,
	): Promise<CatalogRequestModel> {
		return this.catalogRequestsService.removeItemsFromRequest(
			requestId,
			removeItemsDto,
		);
	}
	/**
	 * Edit Items Quantity
	 */
	// @Patch(':id/items/:itemId')
	// editItems(@Param('id') id: string) {
	// 	return 'not-implemented';
	// }
	@Patch(':id/item-count')
	async updateItemCount(
		@Param('id') requestId: string,
		@Body() updateItemCountDto: UpdateItemCountDto,
	): Promise<CatalogRequestModel> {
		return this.catalogRequestsService.updateItemCount(
			requestId,
			updateItemCountDto,
		);
	}

	/**
	 * Authorize User
	 * cancel request
	 * remove completely
	 * only if request is pending
	 */
	// @Delete(':id')
	// cancel(@Param('id') id: string) {
	// 	return this.catalogRequestsService.remove(+id);
	// }
}
