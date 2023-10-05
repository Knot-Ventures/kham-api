import { IsArray, IsEnum, IsInt, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../../../../openapi/decorators';
import { CatalogRequestStatusType } from '../../entities/catalog-request.entity';

export class UpdateCatalogRequestDto {
	@IsInt()
	@OptionalApiProperty()
	itemCount?: number;

	@IsArray()
	@OptionalApiProperty({ isArray: true })
	otherItems?: any[];

	@IsEnum(CatalogRequestStatusType)
	@OptionalApiProperty({ enum: CatalogRequestStatusType })
	status?: CatalogRequestStatusType;

	@IsString()
	@OptionalApiProperty()
	notes?: string;
}