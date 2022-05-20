import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';

@Module({
  providers: [AnimalsService]
})
export class AnimalsModule {}
