import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { CatalogRequestsService } from './catalog-requests.service';
import { CreateCatalogRequestDto } from './dto/create-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/update-catalog-request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('catalog-requests')
@Controller('catalog-requests')
export class CatalogRequestsController {
	constructor(
		private readonly catalogRequestsService: CatalogRequestsService,
	) {}

	/**
	 *
	 * Create a catalog request for the user and notify Kham Sales Team
	 */
	@Post()
	create(@Body() createCatalogRequestDto: CreateCatalogRequestDto) {
		return this.catalogRequestsService.create(createCatalogRequestDto);
	}

	/**
	 * Authorize Kham Sales Team
	 * get All the catalog requests
	 * add select array to select columns from table
	 * implement pagination
	 */
	@Get()
	findAll() {
		return this.catalogRequestsService.findAll();
	}

	/**
	 * Authorize Kham Sales Team
	 * get a specific request
	 */
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.catalogRequestsService.findOne(+id);
	}

	/**
	 * Authorize Kham Sales Team
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
	 *
	 * Nullify or reject a request without delete in the database
	 */
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.catalogRequestsService.remove(+id);
	}
}
