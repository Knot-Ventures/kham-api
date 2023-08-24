import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateCatalogRequestItemDto {
	@IsUUID()
	@ApiProperty()
	catalog_entry_id: string;

	@IsUUID()
	@ApiProperty()
	catalog_request_id: string;

	@IsNumber()
	@ApiProperty()
	quantity: number;
}
