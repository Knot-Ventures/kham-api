import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProductDto {
	@IsString()
	@ApiProperty()
	name: string;

	@IsString()
	@ApiProperty()
	eNumber: string;

	@IsString()
	@ApiProperty()
	otherNames: string;

	@IsString()
	@ApiProperty()
	uses: string;
}
