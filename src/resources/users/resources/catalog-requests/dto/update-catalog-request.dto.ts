import { PartialType } from '@nestjs/swagger';
import { SubmitCatalogRequestDto } from './submit-catalog-request.dto';

export class UpdateCatalogRequestDto extends PartialType(
	SubmitCatalogRequestDto,
) {}
