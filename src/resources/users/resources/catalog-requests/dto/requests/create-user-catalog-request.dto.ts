import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { OptionalApiProperty } from '../../../../../../openapi/decorators';

export class CreateUserCatalogRequestDto {
	@IsArray()
	@OptionalApiProperty({ isArray: true })
	otherItems?: any[];

	@IsString()
	@OptionalApiProperty()
	notes?: string;
}
