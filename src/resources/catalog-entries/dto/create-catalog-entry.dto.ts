import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { ProductEntity } from '../entities/product.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { CreateProductDto } from './create-product.dto';
import { CreateVendorDto } from './create-vendor.dto';

export class CreateCatalogEntryDto {
	@IsString()
	@OptionalApiProperty()
	productId?: string;

	@IsString()
	@OptionalApiProperty()
	vendorId?: string;

	@IsString()
	@ApiProperty()
	description: string;

	@IsArray()
	@IsString({ each: true })
	@OptionalApiProperty({ type: [String] })
	images: string[];

	@IsString()
	@ApiProperty()
	title: string;

	@IsString()
	@OptionalApiProperty()
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

	@OptionalApiProperty({ type: () => CreateProductDto })
	productData?: CreateProductDto;

	@OptionalApiProperty({ type: () => CreateVendorDto })
	vendorData?: CreateVendorDto;
}
