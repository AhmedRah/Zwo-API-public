import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsService } from './animals.service';
import { animalsProviders } from './animals.providers';
import { UploadUtil } from '../../utils/upload';

describe('AnimalsService', () => {
  let service: AnimalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalsService, UploadUtil, ...animalsProviders],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
