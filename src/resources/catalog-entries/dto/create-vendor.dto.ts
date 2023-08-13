import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVendorDto {
	@IsString()
	@ApiProperty()
	name: string;

	@IsString()
	@ApiProperty()
	address: string;

	@IsString()
	@ApiProperty({ required: false })
	image?: string;
}
