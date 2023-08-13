import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { GeoLocation } from '../../utilities/geolocation';

@ApiExtraModels(GeoLocation)
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

	@IsBoolean()
	@OptionalApiProperty()
	default?: boolean;
}
