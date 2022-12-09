import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Animal } from './animal.entity';
import { User } from '../users/user.entity';
import {
  ANIMAL_REPOSITORY,
  ANIMALBREED_REPOSITORY,
} from '../../core/constants';
import { AnimalDto } from './dto/animal.dto';
import { AnimalBreed } from '../animal-breeds/animal-breeds.entity';

@Injectable()
export class AnimalsService {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: typeof Animal,
    @Inject(ANIMALBREED_REPOSITORY)
    private readonly animalBreedRepository: typeof AnimalBreed,
  ) {}

  findAll(user: User): Promise<Animal[]> {
    return this.animalRepository.findAll<Animal>({
      where: { owner: user.id },
      include: [
        {
          model: AnimalBreed,
          as: 'breed',
        },
      ],
    });
  }

  async findOne(id: string, user: User): Promise<Animal> {
    const animal = await this.animalRepository.findOne<Animal>({
      where: { id, owner: user.id },
      include: [
        {
          model: AnimalBreed,
          as: 'breed',
        },
      ],
    });
    if (!animal) {
      throw new NotFoundException(`Animal #${id} not found`);
    }
    return animal;
  }

  async create(animalDto: AnimalDto, user: User): Promise<Animal> {
    const breed = await this.animalBreedRepository.findOne<AnimalBreed>({
      where: { id: animalDto.breedId },
    });

    if (!breed) {
      throw new BadRequestException(`Breed #${animalDto.breedId} not found`);
    }

    try {
      const animal = await this.animalRepository.create<Animal>({
        ...animalDto,
        owner: user.id,
      });

      return this.animalRepository.findOne({
        where: { id: animal.id },
        include: [
          {
            model: AnimalBreed,
            as: 'breed',
          },
        ],
      });
    } catch (e) {
      throw new BadRequestException('Animal values are not valid');
    }
  }

  async update(id: string, animalDto: AnimalDto, user: User): Promise<void> {
    const animal = await this.animalRepository.findOne({
      where: { id, owner: user.id },
    });

    if (!animal) {
      throw new NotFoundException(`Animal #${id} not found`);
    }

    await this.animalRepository.update(
      {
        ...animalDto,
      },
      { where: { id } },
    );
  }

  async remove(id: string, user: User): Promise<void> {
    await this.animalRepository.destroy({
      where: { id, owner: user.id },
    });
  }
}
