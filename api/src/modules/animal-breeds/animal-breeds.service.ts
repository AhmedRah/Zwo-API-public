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

  async findTypes(): Promise<{ type: string; nbBreeds: number }[]> {
    const animalBreeds = await this.animalBreedRepository.findAll<any>({
      attributes: ['type', [sequelize.fn('COUNT', 'breed'), 'nbBreeds']],
      order: [['type', 'ASC']],
      group: ['type'],
    });
    return animalBreeds.map((animalBreed) => {
      return {
        type: animalBreed.type,
        nbBreeds: animalBreed.getDataValue('nbBreeds') - 1,
      };
    });
  }

  async findBreeds(type: string): Promise<string[]> {
    const animalBreeds = await this.animalBreedRepository.findAll<any>({
      where: { type, breed: { [sequelize.Op.not]: null } },
      attributes: ['breed'],
      order: [['breed', 'ASC']],
    });
    if (animalBreeds.length === 0) {
      throw new NotFoundException(`No breeds found`);
    }
    return animalBreeds.map((animalBreed) => animalBreed.breed);
  }
}
