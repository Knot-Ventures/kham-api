import { IsArray, IsNumber, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { ProductEntity } from '../entities/product.entity';
import { VendorEntity } from '../entities/vendor.entity';

export class UpdateCatalogEntryDto {
	@IsString()
	@OptionalApiProperty()
	productId?: string;

	@IsString()
	@OptionalApiProperty()
	vendorId?: string;

	@IsString()
	@OptionalApiProperty()
	description?: string;

	@IsArray()
	@IsString({ each: true })
	@OptionalApiProperty({ type: [String], isArray: true })
	images?: string[];

	@IsString()
	@OptionalApiProperty()
	title?: string;

	@IsString()
	@OptionalApiProperty()
	subtitle?: string;

	@IsNumber()
	@OptionalApiProperty()
	min_qty?: number;

	@IsNumber()
	@OptionalApiProperty()
	available_qty?: number;

	@IsString()
	@OptionalApiProperty()
	unit?: string;

	@IsNumber()
	@OptionalApiProperty()
	average_market_price?: number;

	@OptionalApiProperty({ type: () => ProductEntity })
	product?: ProductEntity;

	@OptionalApiProperty({ type: () => VendorEntity })
	vendor?: VendorEntity;
}
