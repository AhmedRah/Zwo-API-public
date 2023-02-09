import { ANIMAL_REPOSITORY } from '../../core/constants';
import { Animal } from '../animals/animal.entity';

export const imagesProviders = [
  {
    provide: ANIMAL_REPOSITORY,
    useValue: Animal,
  },
];
