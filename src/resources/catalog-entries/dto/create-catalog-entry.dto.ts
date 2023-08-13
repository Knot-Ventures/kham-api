import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { ProductEntity } from '../entities/product.entity';
import { VendorEntity } from '../entities/vendor.entity';

export class CreateCatalogEntryDto {
	@IsString()
	@ApiProperty()
	productId: string;

	@IsString()
	@ApiProperty()
	vendorId: string;

	@IsString()
	@ApiProperty()
	description: string;

	@IsArray()
	@IsString({ each: true })
	@ApiProperty({ type: [String] })
	images: string[];

	@IsString()
	@ApiProperty()
	title: string;

	@IsString()
	@ApiProperty()
	subtitle: string;

	@IsNumber()
	@ApiProperty()
	min_qty: number;

	@IsNumber()
	@ApiProperty()
	available_qty: number;

	@IsString()
	@ApiProperty()
	unit: string;

	@IsNumber()
	@ApiProperty()
	average_market_price: number;

	@OptionalApiProperty({ type: () => ProductEntity })
	product?: ProductEntity;

	@OptionalApiProperty({ type: () => VendorEntity })
	vendor?: VendorEntity;
}
