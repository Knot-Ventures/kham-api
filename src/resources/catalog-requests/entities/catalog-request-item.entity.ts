import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import { CatalogEntryEntity } from 'src/resources/catalog-entries/entities/catalog-entry.entity';
import catalogRequestItems from '../../../drizzle/schema/catalog_request_items';
import { CatalogRequestEntity } from './catalog-request.entity';

export type CatalogRequestItemsModel = InferModel<typeof catalogRequestItems>;

export class CatalogRequestItemEntity implements CatalogRequestItemsModel {
	@ApiProperty()
	id: string;

	@ApiProperty()
	catalog_entry_id: string;

	@ApiProperty()
	catalog_request_id: string;

	@ApiProperty()
	quantity: number;

	// Relations
	@ApiProperty({ type: () => CatalogEntryEntity })
	catalogEntry: CatalogEntryEntity;

	@ApiProperty({ type: () => CatalogRequestEntity })
	catalogRequest: CatalogRequestEntity;
}
