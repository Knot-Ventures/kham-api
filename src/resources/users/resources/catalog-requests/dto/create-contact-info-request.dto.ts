import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { OptionalApiProperty } from '../../../../../openapi/decorators';
import { GeoLocation } from '../entities/contact-info.entity';

export class CreateContactInfoDto {
	@IsString()
	@ApiProperty()
	governorate: string;

	@IsString()
	@ApiProperty()
	city: string;

	@IsString()
	@ApiProperty()
	address: string;

	@IsString()
	@ApiProperty()
	phoneNumber: string;

	@IsEmail()
	@ApiProperty()
	email: string;

	@OptionalApiProperty({
		type: () => GeoLocation,
		example: { latitude: '123', longitude: '456' },
	})
	location?: GeoLocation;
}
