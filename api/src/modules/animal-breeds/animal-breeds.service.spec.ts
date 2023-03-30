import { Test, TestingModule } from '@nestjs/testing';
import { AnimalBreedsService } from './animal-breeds.service';
import { animalBreedsProviders } from './animal-breeds.providers';

/*
const listTypes = [
  {
    type: 'dog',
    nbBreeds: 2,
  },
  {
    type: 'cat',
    nbBreeds: 3,
  },
  {
    type: 'bird',
    nbBreeds: 0,
  },
];

const listBreedsByCat = ['persian', 'siamese', 'ragdoll'];
 */

describe('AnimalBreedsService', () => {
  let service: AnimalBreedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalBreedsService, ...animalBreedsProviders],
    }).compile();

    service = module.get<AnimalBreedsService>(AnimalBreedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
