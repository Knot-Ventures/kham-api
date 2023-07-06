import { PartialType } from '@nestjs/swagger';
import { CreateCatalogRequestDto } from './create-catalog-request.dto';

export class UpdateCatalogRequestDto extends PartialType(CreateCatalogRequestDto) {}
