import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { VendorEntity } from '../entities/vendor.entity';
import { OptionalApiProperty } from '../../../openapi/decorators';

export class CreateVendorDto implements Partial<Omit<VendorEntity, 'id'>> {
	@IsString()
	@ApiProperty({ example: 'Kham' })
	name: string;

	@IsString()
	@ApiProperty({ example: 'New Cairo, Egypt' })
	address: string;

	@IsString()
	@OptionalApiProperty()
	image?: string;
}
