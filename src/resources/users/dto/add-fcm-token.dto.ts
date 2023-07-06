import { ApiProperty } from '@nestjs/swagger';

export class AddFcmTokenDto {
	@ApiProperty()
	token: string;
}
