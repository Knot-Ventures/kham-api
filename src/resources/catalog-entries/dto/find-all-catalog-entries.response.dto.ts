import { ApiResponseProperty } from '@nestjs/swagger';
import { CatalogEntryEntity } from '../entities/catalog-entry.entity';

export class FindAllCatalogEntriesResponseDto {
	@ApiResponseProperty()
	limit: number;

	@ApiResponseProperty()
	page: number;

	@ApiResponseProperty({ type: () => CatalogEntryEntity })
	data: CatalogEntryEntity[];
}
