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
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CatalogEntriesService } from './catalog-entries.service';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';
import { UpdateCatalogEntryDto } from './dto/update-catalog-entry.dto';
import { CatalogEntryEntity } from './entities/catalog-entry.entity';

@ApiTags('catalog-entries')
@Controller('catalog-entries')
export class CatalogEntriesController {
	constructor(
		private readonly catalogEntriesService: CatalogEntriesService,
	) {}

	/**
	 * Authorize Knot Sales/Admin
	 * Validate Product Id, Vendor
	 * Add a new Catalog Entry
	 */
	@ApiBody({ type: CreateCatalogEntryDto })
	@ApiResponse({
		description: 'The catalog entry has been successfully created.',
		type: CatalogEntryEntity,
	})
	@Post()
	create(
		@Body() createCatalogEntryDto: CreateCatalogEntryDto,
	): Promise<CatalogEntryEntity> {
		return this.catalogEntriesService.create(createCatalogEntryDto);
	}

	/**
	 * Public
	 * fetch with categories
	 * paginate
	 */
	@ApiOperation({ summary: 'Get all catalog entries' })
	@ApiOkResponse({ type: CatalogEntryEntity, isArray: true })
	@ApiQuery({ name: 'page', required: false, type: Number })
	@ApiQuery({ name: 'limit', required: false, type: Number })
	@Get()
	findAll(
		@Query('page') page = 1,
		@Query('limit') limit = 10,
	): Promise<CatalogEntryEntity[]> {
		return this.catalogEntriesService.findAll(page, limit);
	}

	/**
	 * Public
	 * fetch with categories and similar products ( if there are entries with same product or entries in the same category)
	 */
	@ApiOperation({ summary: 'Get a catalog entry by ID' })
	@ApiOkResponse({ type: CatalogEntryEntity })
	@ApiParam({ name: 'id', type: String })
	@Get(':id')
	findOne(@Param('id') id: string): Promise<CatalogEntryEntity> {
		return this.catalogEntriesService.findOne(id);
	}

	/**
	 * Authorize Knot Sales/Admin
	 * Validate Product Id, Vendor
	 * Edit the Catalog Entry
	 */
	@ApiOperation({ summary: 'Update a catalog Entry by ID' })
	@ApiBody({ type: UpdateCatalogEntryDto })
	@ApiOkResponse({ type: CatalogEntryEntity })
	@ApiParam({ name: 'id', type: String })
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateCatalogEntryDto: UpdateCatalogEntryDto,
	): Promise<CatalogEntryEntity> {
		return this.catalogEntriesService.update(id, updateCatalogEntryDto);
	}

	/**
	 * Remove from rotation without delete
	 */
	@ApiOperation({ summary: 'Remove a catalog entry from rotation by ID' })
	// @ApiParam({ name: 'id', type:  })
	@Delete(':id')
	remove(@Param('id') id: string): Promise<CatalogEntryEntity> {
		return this.catalogEntriesService.remove(id);
	}
}
