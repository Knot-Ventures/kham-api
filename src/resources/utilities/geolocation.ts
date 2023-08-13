import { ApiProperty } from '@nestjs/swagger';

export class GeoLocation {
	@ApiProperty()
	latitude: string;
	@ApiProperty()
	longitude: string;
}
