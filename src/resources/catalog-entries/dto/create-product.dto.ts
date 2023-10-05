import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import {
	ProductEntity,
	ProductIdentifierType,
} from '../entities/product.entity';
import { OptionalApiProperty } from '../../../openapi/decorators';

export class CreateProductDto implements Partial<Omit<ProductEntity, 'id'>> {
	@IsString()
	@ApiProperty({ example: 'Testing Product' })
	name: string;

	@IsString({ each: true })
	@OptionalApiProperty({ type: String, isArray: true, example: ['Tester'] })
	otherNames: string[];

	@IsString({ each: true })
	@OptionalApiProperty({ type: String, isArray: true, example: ['Testing'] })
	uses: string[];

	@IsString()
	@ApiProperty({ example: 'E123' })
	identifier: string;

	@IsEnum(ProductIdentifierType)
	@ApiProperty({
		enum: ProductIdentifierType,
		example: ProductIdentifierType.E_NUMBER,
	})
	identifierType: ProductIdentifierType;
}
