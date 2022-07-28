import { AnimalBreed } from './animal-breeds.entity';
import { ANIMALBREED_REPOSITORY } from '../../core/constants';

export const animalBreedsProviders = [
  {
    provide: ANIMALBREED_REPOSITORY,
    useValue: AnimalBreed,
  },
];
