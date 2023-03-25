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
import { UploadUtil } from '../../utils/upload';

@Injectable()
export class AnimalsService {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: typeof Animal,
    @Inject(ANIMALBREED_REPOSITORY)
    private readonly animalBreedRepository: typeof AnimalBreed,
    private readonly uploadUtil: UploadUtil,
  ) {}

  async findOne(id: string) {
    const animal = await this.animalRepository.findOne<Animal>({
      where: { id },
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
    return animal.profile;
  }

  async create(
    animalDto: AnimalDto,
    user: User,
    animalFile?: Express.Multer.File,
  ): Promise<void> {
    const newAnimal: any = {
      ...animalDto,
      owner: user.id,
    };

    try {
      await this.animalRepository.create<Animal>(newAnimal);
    } catch (e) {
      throw new BadRequestException('Animal values are not valid');
    }

    // Save animal file
    if (animalFile) {
      const avatar = await this.uploadUtil.saveImage(
        animalFile,
        500,
        process.env.UPLOAD_PATH_ANIMALS,
      );

      await this.animalRepository.update(
        { avatar },
        { where: { id: newAnimal.id } },
      );
    }
  }

  async update(
    id: string,
    animalDto: AnimalDto,
    user: User,
    animalFile?: Express.Multer.File,
  ): Promise<void> {
    const animal = await this.animalRepository.findOne({
      where: { id, owner: user.id },
    });

    if (!animal) {
      throw new NotFoundException(`Animal #${id} not found`);
    }

    const updatedAnimal: any = {
      name: animalDto.name,
      description: animalDto.description,
      birthday: animalDto.birthday,
      weight: animalDto.weight,
      breedId: animalDto.breedId,
    };

    try {
      await this.animalRepository.update(updatedAnimal, { where: { id } });
    } catch (e) {
      throw new BadRequestException('Animal values are not valid');
    }

    // Delete old image
    // TODO: Trouver une solution pour supprimer l'ancienne image si on envoi null
    if (animalFile && animal.avatar) {
      this.uploadUtil.deleteFile(
        animal.avatar,
        process.env.UPLOAD_PATH_ANIMALS,
      );
    }

    // Save animal file
    if (animalFile) {
      const avatar = await this.uploadUtil.saveImage(
        animalFile,
        500,
        process.env.UPLOAD_PATH_ANIMALS,
      );

      await this.animalRepository.update({ avatar }, { where: { id } });
    }
  }

  async remove(id: string, user: User): Promise<void> {
    await this.animalRepository.destroy({
      where: { id, owner: user.id },
    });
  }
}
