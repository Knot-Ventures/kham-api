import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddFcmTokenDto {
	@IsString()
	@ApiProperty({ type: String, required: true })
	token: string;
}
