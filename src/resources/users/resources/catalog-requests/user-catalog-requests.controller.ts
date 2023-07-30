import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { UserCatalogRequestsService } from './user-catalog-requests.service';
import { SubmitCatalogRequestDto } from './dto/submit-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/update-catalog-request.dto';
import { CreateCatalogRequestDto } from './dto/create-catalog-request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users-catalog-requests')
@Controller(':uid/catalog-requests')
export class UserCatalogRequestsController {
	constructor(
		private readonly catalogRequestsService: UserCatalogRequestsService,
	) {}

	/**
	 * Authorize User
	 * Create A catalog request ({status: 'parked'}) to allow the user to add items
	 */
	@Post()
	create(@Body() createCatalogRequestDto: CreateCatalogRequestDto) {
		return this.catalogRequestsService.create(createCatalogRequestDto);
	}

	/**
	 * Authorize User
	 * Submit a catalog request for the user and notify Kham Sales Team
	 */
	@Patch()
	submit(@Body() submitCatalogRequestDto: SubmitCatalogRequestDto) {
		return this.catalogRequestsService.submit(submitCatalogRequestDto);
	}

	/**
	 * Authorize User
	 * get All the catalog requests for the current user
	 * add select array to select columns from table
	 * implement pagination
	 */
	@Get()
	findAll() {
		return this.catalogRequestsService.findAll();
	}

	/**
	 * Authorize User
	 * get the latest request that has not been pushed (ie; current cart)
	 */
	@Get('current')
	findCurrent() {}

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
