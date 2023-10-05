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
	ApiConsumes,
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
import { FindAllCatalogEntriesResponseDto } from './dto/find-all-catalog-entries.response.dto';

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
	@ApiOperation({
		summary: 'Create a new catalog entry',
		description: `To create a new catalog entry it needs to be associated with a vendor and a product. you have to provide the id or the data for each of the vendor and the product.
		If either of them already exists, then just provide its ID, else provide the data to create a new one. **Keep in mind you need proper permissions to create new data.** `,
	})
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
	@ApiOkResponse({ type: FindAllCatalogEntriesResponseDto })
	@ApiQuery({ name: 'page', required: false, type: Number })
	@ApiQuery({ name: 'limit', required: false, type: Number })
	@Get()
	findAll(
		@Query('page') page = 1,
		@Query('limit') limit = 10,
	): Promise<FindAllCatalogEntriesResponseDto> {
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
	@ApiConsumes('application/json', 'multipart/form-data')
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
	@Delete(':id')
	remove(@Param('id') id: string): Promise<CatalogEntryEntity> {
		return this.catalogEntriesService.remove(id);
	}
}
