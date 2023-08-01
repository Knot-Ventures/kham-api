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
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { CreateCatalogRequestDto } from './dto/create-catalog-request.dto';
import { SubmitCatalogRequestDto } from './dto/submit-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/update-catalog-request.dto';
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
	 * Authorize User
	 * get the latest request that has not been pushed (ie; current cart)
	 */
	// @Get('current')
	// findCurrent() {}

	/**
	 * Authorize User
	 * get a specific request
	 * with Items and Contact Info
	 */
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.catalogRequestsService.findOne(+id);
	}

	/**
	 * Authorize User
	 * update specific properties
	 * Not all properties will be allowed to change TBD
	 */
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateCatalogRequestDto: UpdateCatalogRequestDto,
	) {
		return this.catalogRequestsService.update(+id, updateCatalogRequestDto);
	}

	/**
	 * Authorize User
	 * validate if there's an available request to add the items to (if not then create one)
	 * Add Items to the Request
	 */
	@Post(':id/items')
	addItems(@Param('id') id: string) {
		return 'not-implemented';
	}

	/**
	 * Authorize User
	 * remove items from request
	 */
	@Delete(':id/items')
	removeItems(@Param('id') id: string) {
		return 'not-implemented';
	}

	/**
	 * Authorize User
	 * Edit Items Quantity
	 */
	@Patch(':id/items/:itemId')
	editItems(@Param('id') id: string) {
		return 'not-implemented';
	}

	/**
	 * Authorize User
	 * cancel request
	 * remove completely
	 * only if request is pending
	 */
	@Delete(':id')
	cancel(@Param('id') id: string) {
		return this.catalogRequestsService.remove(+id);
	}
}
