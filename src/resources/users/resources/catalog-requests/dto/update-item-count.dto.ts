import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateItemCountDto {
	@IsInt()
	@ApiProperty()
	itemCount: number;
}
