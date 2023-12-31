import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

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

	@IsOptional()
	@ApiProperty({ type: 'object', example: { latitude: 123, longitude: 456 } })
	location?: { latitude: number; longitude: number };

	@IsBoolean()
	@IsOptional()
	@ApiProperty()
	default?: boolean;
}
