import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { CatalogRequestStatusType } from '../entities/catalog-request.entity';

export class UpdateCatalogRequestDto {
	@IsString()
	@IsOptional()
	@ApiProperty()
	userId?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	requestContactInfoId?: string;

	@IsInt()
	@IsOptional()
	@ApiProperty()
	itemCount?: number;

	@IsArray()
	@IsOptional()
	@ApiProperty({ isArray: true })
	otherItems?: any[];

	@IsEnum(CatalogRequestStatusType)
	@IsOptional()
	@ApiProperty({ enum: CatalogRequestStatusType })
	status?: CatalogRequestStatusType;

	@IsString()
	@IsOptional()
	@ApiProperty()
	notes?: string;
}
