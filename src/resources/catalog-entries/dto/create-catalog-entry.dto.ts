import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
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

	@IsOptional()
	@ApiPropertyOptional({ type: () => ProductEntity })
	product?: ProductEntity;

	@IsOptional()
	@ApiPropertyOptional({ type: () => VendorEntity })
	vendor?: VendorEntity;
}
