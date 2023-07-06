import { Test, TestingModule } from '@nestjs/testing';
import { CatalogRequestsService } from './catalog-requests.service';

describe('CatalogRequestsService', () => {
  let service: CatalogRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogRequestsService],
    }).compile();

    service = module.get<CatalogRequestsService>(CatalogRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
