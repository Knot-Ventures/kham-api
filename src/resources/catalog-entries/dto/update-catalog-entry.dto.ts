import { PartialType } from '@nestjs/swagger';
import { CreateCatalogEntryDto } from './create-catalog-entry.dto';

export class UpdateCatalogEntryDto extends PartialType(CreateCatalogEntryDto) {}
