import { Test, TestingModule } from '@nestjs/testing';
import { CatalogEntriesController } from './catalog-entries.controller';
import { CatalogEntriesService } from './catalog-entries.service';

describe('CatalogEntriesController', () => {
  let controller: CatalogEntriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogEntriesController],
      providers: [CatalogEntriesService],
    }).compile();

    controller = module.get<CatalogEntriesController>(CatalogEntriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
