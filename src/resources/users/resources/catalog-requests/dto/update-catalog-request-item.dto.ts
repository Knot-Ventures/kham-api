import { IsInt } from 'class-validator';

export class UpdateCatalogRequestItemDto {
	@IsInt()
	quantity: number;
}
