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
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { CreateUserCatalogRequestDto } from './dto/requests/create-user-catalog-request.dto';
import { SubmitUserCatalogRequestDto } from './dto/requests/submit-user-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/requests/update-catalog-request.dto';
import {
	CatalogRequestEntity,
	CatalogRequestModel,
} from './entities/catalog-request.entity';
import { UserCatalogRequestsService } from './user-catalog-requests.service';
import { Auth } from '../../../../auth/decorators/auth.decorator';
import { FindAllCatalogRequestsResponseDto } from './dto/responses/find-all-catalog-requests.response.dto';

@ApiTags('users-catalog-requests')
@Controller(':uid/catalog-requests')
@Auth()
export class UserCatalogRequestsController {
	constructor(
		private readonly catalogRequestsService: UserCatalogRequestsService,
	) {}

	/**
	 * Authorize User
	 * Create A catalog request ({status: 'parked'}) to allow the user to add items
	 */
	@ApiOperation({
		summary: 'Create A Catalog Request',
	})
	@ApiCreatedResponse({ type: CatalogRequestEntity })
	@ApiBody({ type: () => CreateUserCatalogRequestDto })
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@Post()
	create(
		@Param('uid') uid: string,
		@Body() createCatalogRequestDto: CreateUserCatalogRequestDto,
	): Promise<CatalogRequestEntity> {
		return this.catalogRequestsService.create(uid, createCatalogRequestDto);
	}

	/**
	 * Authorize User
	 * Submit a catalog request for the user and notify Kham Sales Team //TODO
	 */
	@ApiOperation({
		summary: 'Submit a catalog request for the user',
	})
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@ApiParam({ name: 'rid', type: 'string', description: 'Request Id' })
	@Patch(':rid/submit')
	submit(
		@Param('rid') requestId: string,
		@Param('uid') uid: string,
		@Body() submitCatalogRequestDto: SubmitUserCatalogRequestDto,
	): Promise<CatalogRequestModel> {
		return this.catalogRequestsService.submit(
			uid,
			requestId,
			submitCatalogRequestDto,
		);
	}

	/**
	 * Authorize User
	 * get All the catalog requests for the current user
	 * add select array to select columns from table
	 * implement pagination
	 */
	@ApiOperation({ summary: 'Get all catalog requests' })
	@ApiOkResponse({ type: FindAllCatalogRequestsResponseDto })
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'The number of page you want to query',
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
		description: 'The number of elements per page',
	})
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@Get()
	async findAll(
		@Param('uid') uid: string,
		@Query('page') page = 1,
		@Query('limit') limit = 10,
	): Promise<FindAllCatalogRequestsResponseDto> {
		return this.catalogRequestsService.findAll(page, limit);
	}

	/**
	 * Authorize User
	 * get the latest request that has not been pushed (ie; current cart)
	 */

	/**
	 * Authorize User
	 * get a specific request
	 * with Items and Contact Info
	 */
	@ApiOperation({ summary: 'Get a catalog request by ID' })
	@ApiOkResponse({ type: CatalogRequestEntity })
	@ApiParam({ name: 'rid', type: 'string', description: 'Request Id' })
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@Get(':rid')
	async findOne(
		@Param('uid') uid: string,
		@Param('rid') requestId: string,
	): Promise<CatalogRequestEntity> {
		return this.catalogRequestsService.findOne(requestId);
	}

	/**
	 * Authorize User
	 * update specific properties
	 * Not all properties will be allowed to change TBD
	 */
	@ApiOperation({ summary: 'Update a catalog request by ID' })
	@ApiBody({ type: UpdateCatalogRequestDto })
	@ApiOkResponse({ type: CatalogRequestEntity })
	@ApiParam({ name: 'rid', type: 'string', description: 'Request Id' })
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@Patch(':rid')
	async update(
		@Param('uid') uid: string,
		@Param('rid') id: string,
		@Body() updateCatalogRequestDto: UpdateCatalogRequestDto,
	): Promise<CatalogRequestModel> {
		return this.catalogRequestsService.update(id, updateCatalogRequestDto);
	}

	/**
	 * Authorize User
	 * cancel request
	 * remove completely
	 * only if request is pending
	 */
	@ApiOperation({
		summary: 'Cancel Request',
	})
	@ApiParam({ name: 'rid', type: 'string', description: 'Request Id' })
	@ApiParam({ name: 'uid', type: 'string', description: 'User Id' })
	@Delete(':rid')
	async cancelCatalogRequest(
		@Param('uid') uid: string,
		@Param('rid') requestId: string,
	) {
		return this.catalogRequestsService.cancelCatalogRequest(requestId);
	}
}
