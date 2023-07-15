import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserContactInfoDto {
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
	@ApiProperty()
	location?: any;

	@IsBoolean()
	@IsOptional()
	@ApiProperty()
	default?: boolean;
}
