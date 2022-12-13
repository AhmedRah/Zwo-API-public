import {
  ANIMAL_REPOSITORY,
  ANIMALBREED_REPOSITORY,
} from '../../core/constants';
import { Animal } from './animal.entity';
import { AnimalBreed } from '../animal-breeds/animal-breeds.entity';

export const animalsProviders = [
  {
    provide: ANIMAL_REPOSITORY,
    useValue: Animal,
  },
  {
    provide: ANIMALBREED_REPOSITORY,
    useValue: AnimalBreed,
  },
];
