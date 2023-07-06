import { Injectable } from '@nestjs/common';
import { CreateCatalogRequestDto } from './dto/create-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/update-catalog-request.dto';

@Injectable()
export class CatalogRequestsService {
  create(createCatalogRequestDto: CreateCatalogRequestDto) {
    return 'This action adds a new catalogRequest';
  }

  findAll() {
    return `This action returns all catalogRequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catalogRequest`;
  }

  update(id: number, updateCatalogRequestDto: UpdateCatalogRequestDto) {
    return `This action updates a #${id} catalogRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} catalogRequest`;
  }
}
