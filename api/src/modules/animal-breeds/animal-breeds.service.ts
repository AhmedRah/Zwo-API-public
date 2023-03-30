import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ANIMALBREED_REPOSITORY } from '../../core/constants';
import { AnimalBreed } from './animal-breeds.entity';
import sequelize from 'sequelize';

@Injectable()
export class AnimalBreedsService {
  constructor(
    @Inject(ANIMALBREED_REPOSITORY)
    private readonly animalBreedRepository: typeof AnimalBreed,
  ) {}

  async findTypes() {
    const animalBreeds = await this.animalBreedRepository.findAll<any>({
      where: { breed: { [sequelize.Op.eq]: null } },
      order: [['type', 'ASC']],
    });

    // Get the number of breeds for each type
    const breeds = await this.animalBreedRepository.findAll<any>({
      attributes: ['type', [sequelize.fn('COUNT', 'breed'), 'nbBreeds']],
      order: [['type', 'ASC']],
      group: ['type'],
    });

    // Merge the two arrays
    return animalBreeds.map((animalBreed) => {
      const breed = breeds.find((breed) => breed.type === animalBreed.type);
      return {
        ...animalBreed.typeDetail,
        nbBreeds: breed.getDataValue('nbBreeds') - 1 || 0,
      };
    });
  }

  async findBreeds(type: string) {
    const animalBreeds = await this.animalBreedRepository.findAll<any>({
      where: { type, breed: { [sequelize.Op.not]: null } },
      order: [['breed', 'ASC']],
    });
    if (animalBreeds.length === 0) {
      throw new NotFoundException(`No breeds found`);
    }
    return animalBreeds.map((animalBreed) => animalBreed.breedDetail);
  }
}
