import { IsArray } from 'class-validator';

export class AddItemsToRequestDto {
	@IsArray()
	items: string[]; // Replace 'string' with the type of your item entity ID
}
