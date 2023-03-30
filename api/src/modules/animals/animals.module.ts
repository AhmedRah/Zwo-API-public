import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { animalsProviders } from './animals.providers';

@Module({
  controllers: [AnimalsController],
  providers: [AnimalsService, ...animalsProviders],
  exports: [AnimalsService],
})
export class AnimalsModule {}
