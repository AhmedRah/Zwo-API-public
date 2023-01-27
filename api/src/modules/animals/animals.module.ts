import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { animalsProviders } from './animals.providers';
import { UploadUtil } from '../../utils/upload';

@Module({
  controllers: [AnimalsController],
  providers: [AnimalsService, UploadUtil, ...animalsProviders],
  exports: [AnimalsService],
})
export class AnimalsModule {}
