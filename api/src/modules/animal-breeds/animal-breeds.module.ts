import { Module } from '@nestjs/common';
import { AnimalBreedsService } from './animal-breeds.service';
import { animalBreedsProviders } from './animal-breeds.providers';
import { AnimalBreedsController } from './animal-breeds.controller';

@Module({
  controllers: [AnimalBreedsController],
  providers: [AnimalBreedsService, ...animalBreedsProviders],
  exports: [AnimalBreedsService],
})
export class AnimalBreedsModule {}
import { Module } from '@nestjs/common';
import { AnimalBreedsService } from './animal-breeds.service';
import { animalBreedsProviders } from './animal-breeds.providers';

@Module({
  providers: [AnimalBreedsService, ...animalBreedsProviders],
  exports: [AnimalBreedsService],
})
export class AnimalBreedsModule {}
