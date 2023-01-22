import {
  Inject,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { createReadStream } from 'fs';
import { ANIMAL_REPOSITORY } from '../../core/constants';
import { Animal } from '../animals/animal.entity';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: typeof Animal,
  ) {}

  getImageUrl(type: string, id: string, imagePath: string): string {
    return `${process.env.API_URL}/${type}/${id}/${imagePath}`;
  }

  async findImage(
    res: Response,
    type: string,
    id: string,
    imagePath: string,
  ): Promise<StreamableFile> {
    let path = null;

    // TODO: Add other types
    if (type === 'animals') {
      path = await this.getAnimalImagePath(id, imagePath);
    } else {
      throw new NotFoundException(`Image not found`);
    }

    const file = createReadStream(path);
    res.set({
      'Content-Type': 'image/webp',
    });
    return new StreamableFile(file);
  }

  private async getAnimalImagePath(
    id: string,
    imagePath: string,
  ): Promise<string> {
    const animal = await this.animalRepository.findOne({
      where: { id, avatar: imagePath },
    });

    if (!animal) {
      throw new NotFoundException(`Image not found`);
    }

    return join(process.cwd(), process.env.UPLOAD_PATH_ANIMALS, imagePath);
  }
}
