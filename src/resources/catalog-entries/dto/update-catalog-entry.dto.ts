import { IsArray, IsNumber, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';

export class UpdateCatalogEntryDto {
	@IsString()
	@OptionalApiProperty()
	description?: string;

	@IsArray()
	@IsString({ each: true })
	@OptionalApiProperty({ type: [String] })
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
}
