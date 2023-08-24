import { ApiProperty } from '@nestjs/swagger';
import { CatalogRequestEntity } from '../../entities/catalog-request.entity';

export class FindAllCatalogRequestsResponseDto {
	@ApiProperty()
	page: number;
	@ApiProperty()
	limit: number;
	@ApiProperty({ type: () => CatalogRequestEntity, isArray: true })
	data: CatalogRequestEntity[];
}
