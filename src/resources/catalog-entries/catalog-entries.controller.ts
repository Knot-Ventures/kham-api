import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
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
	@Get()
	findAll() {
		return this.catalogEntriesService.findAll();
	}

	/**
	 * Public
	 * fetch with categories and similar products ( if there are entries with same product or entries in the same category)
	 */
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.catalogEntriesService.findOne(+id);
	}

	/**
	 * Authorize Knot Sales/Admin
	 * Validate Product Id, Vendor
	 * Edit the Catalog Entry
	 */
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateCatalogEntryDto: UpdateCatalogEntryDto,
	) {
		return this.catalogEntriesService.update(+id, updateCatalogEntryDto);
	}

	/**
	 * Remove from rotation without delete
	 */
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.catalogEntriesService.remove(+id);
	}
}
