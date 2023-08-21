import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { GeoLocation } from '../../../data/geolocation';

@ApiExtraModels(GeoLocation)
export class CreateContactInfoDto {
	@IsString()
	@ApiProperty({ example: 'Cairo' })
	governorate: string;

	@IsString()
	@ApiProperty({ example: 'Nasr City' })
	city: string;

	@IsString()
	@ApiProperty({ example: '1st Area, Bld.02, Apt.01' })
	address: string;

	@IsString()
	@ApiProperty({ example: '+20-123-456-7890' })
	phoneNumber: string;

	@IsEmail()
	@ApiProperty({ example: 'john.doe@kham.shop' })
	email: string;

	@OptionalApiProperty({
		type: () => GeoLocation,
	})
	location?: GeoLocation;

	@IsBoolean()
	@OptionalApiProperty()
	default?: boolean;
}
