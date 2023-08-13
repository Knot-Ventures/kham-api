import { IsArray } from 'class-validator';

export class ItemsDto {
	@IsArray()
	items: string[];
}
