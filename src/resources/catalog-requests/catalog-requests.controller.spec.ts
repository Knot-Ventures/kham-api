import { Test, TestingModule } from '@nestjs/testing';
import { CatalogRequestsController } from './catalog-requests.controller';
import { CatalogRequestsService } from './catalog-requests.service';

describe('CatalogRequestsController', () => {
  let controller: CatalogRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogRequestsController],
      providers: [CatalogRequestsService],
    }).compile();

    controller = module.get<CatalogRequestsController>(CatalogRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
