import { Test, TestingModule } from '@nestjs/testing';
import { CatalogEntriesService } from './catalog-entries.service';

describe('CatalogEntriesService', () => {
	let service: CatalogEntriesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CatalogEntriesService],
		}).compile();

		service = module.get<CatalogEntriesService>(CatalogEntriesService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
