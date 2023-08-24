import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateCatalogRequestItemDto {
	@IsInt()
	@ApiProperty()
	quantity: number;
}
