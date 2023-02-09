import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { imagesProviders } from './images.providers';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, ...imagesProviders],
  exports: [ImagesService],
})
export class ImagesModule {}
