import { Injectable } from '@nestjs/common';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';
import { UpdateCatalogEntryDto } from './dto/update-catalog-entry.dto';

@Injectable()
export class CatalogEntriesService {
  create(createCatalogEntryDto: CreateCatalogEntryDto) {
    return 'This action adds a new catalogEntry';
  }

  findAll() {
    return `This action returns all catalogEntries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catalogEntry`;
  }

  update(id: number, updateCatalogEntryDto: UpdateCatalogEntryDto) {
    return `This action updates a #${id} catalogEntry`;
  }

  remove(id: number) {
    return `This action removes a #${id} catalogEntry`;
  }
}
