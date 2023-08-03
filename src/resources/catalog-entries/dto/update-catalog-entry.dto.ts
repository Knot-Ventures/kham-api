import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { ProductEntity } from '../entities/product.entity';
import { VendorEntity } from '../entities/vendor.entity';

export class UpdateCatalogEntryDto {
	@IsString()
	@ApiPropertyOptional()
	productId?: string;

	@IsString()
	@ApiPropertyOptional()
	vendorId?: string;

	@IsString()
	@ApiPropertyOptional()
	description?: string;

	@IsArray()
	@IsString({ each: true })
	@ApiPropertyOptional({ type: [String] })
	images?: string[];

	@IsString()
	@ApiPropertyOptional()
	title?: string;

	@IsString()
	@ApiPropertyOptional()
	subtitle?: string;

	@IsNumber()
	@ApiPropertyOptional()
	min_qty?: number;

	@IsNumber()
	@ApiPropertyOptional()
	available_qty?: number;

	@IsString()
	@ApiPropertyOptional()
	unit?: string;

	@IsNumber()
	@ApiPropertyOptional()
	average_market_price?: number;

	@ApiPropertyOptional({ type: () => ProductEntity })
	product?: ProductEntity;

	@ApiPropertyOptional({ type: () => VendorEntity })
	vendor?: VendorEntity;
}
