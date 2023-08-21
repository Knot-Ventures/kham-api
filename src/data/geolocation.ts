import { ApiProperty } from '@nestjs/swagger';

export class GeoLocation {
	@ApiProperty({ example: '123' })
	latitude: string;
	@ApiProperty({ example: '456' })
	longitude: string;
}
