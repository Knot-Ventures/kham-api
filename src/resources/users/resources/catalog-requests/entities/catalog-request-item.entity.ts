import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import catalogRequestItems from '../../../../../drizzle/schema/catalog_request_items';

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

	// // Relations
	// @ApiProperty({ type: () => CatalogEntryModel })
	// catalogEntry: CatalogEntryModel;

	// @ApiProperty({ type: () => CatalogRequestModel })
	// catalogRequest: CatalogRequestModel;
}
