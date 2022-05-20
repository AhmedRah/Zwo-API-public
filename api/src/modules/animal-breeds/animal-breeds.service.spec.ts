import { Test, TestingModule } from '@nestjs/testing';
import { AnimalBreedsService } from './animal-breeds.service';

describe('AnimalBreedsService', () => {
  let service: AnimalBreedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalBreedsService],
    }).compile();

    service = module.get<AnimalBreedsService>(AnimalBreedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
