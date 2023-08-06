import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';

export class CreateVendorDto {
	@IsString()
	@ApiProperty()
	name: string;

	@IsString()
	@ApiProperty()
	address: string;

	@IsString()
	@OptionalApiProperty()
	image?: string;
}
