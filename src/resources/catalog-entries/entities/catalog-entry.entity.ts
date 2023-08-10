import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import catalogEntries from '../../../drizzle/schema/catalog_entries';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { ProductEntity } from './product.entity';
import { VendorEntity } from './vendor.entity';

export type CatalogEntryModel = InferModel<typeof catalogEntries>;

export class CatalogEntryEntity implements CatalogEntryModel {
	@ApiProperty()
	id: string;

	@ApiProperty()
	productId: string;

	@ApiProperty()
	vendorId: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	images: string[];

	@ApiProperty()
	title: string;

	@ApiProperty()
	subtitle: string;

	@ApiProperty()
	min_qty: number;

	@ApiProperty()
	available_qty: number;

	@ApiProperty()
	unit: string;

	@ApiProperty()
	average_market_price: number;

	@OptionalApiProperty()
	isRemoved: boolean;

	@OptionalApiProperty({ type: () => ProductEntity })
	product?: ProductEntity;

	@OptionalApiProperty({ type: () => VendorEntity })
	vendor?: VendorEntity;

	// @OptionalApiProperty({ type: () => CatalogRequestItemEntity, isArray: true })
	// catalogRequestItems: CatalogRequestItemEntity[];
}
