import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import products from '../../../drizzle/schema/products';
import { EnumTypeFromMap } from '../../../helpers/EnumTypeFromMap';
import { OptionalApiProperty } from '../../../openapi/decorators';
import * as uuid from 'uuid';

export type ProductModel = InferModel<typeof products>;

export const ProductIdentifierType = {
	E_NUMBER: 'e_number',
	OTHER: 'other',
} as const;

export type ProductIdentifierType = EnumTypeFromMap<
	typeof ProductIdentifierType
>;
export class ProductEntity implements Partial<ProductModel> {
	@ApiProperty({ example: uuid.v1() })
	id: string;

	@ApiProperty({ example: 'Testing Product' })
	name: string;

	@OptionalApiProperty({ type: String, isArray: true, example: ['Tester'] })
	otherNames?: string[];

	@OptionalApiProperty({ type: String, isArray: true, example: ['Testing'] })
	uses?: string[];

	@ApiProperty({ example: 'E123' })
	identifier: string;

	@ApiProperty({
		enum: ProductIdentifierType,
		example: ProductIdentifierType.E_NUMBER,
	})
	identifierType: ProductIdentifierType;
}
