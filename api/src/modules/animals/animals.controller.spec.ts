import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { animalsProviders } from './animals.providers';
import { UploadUtil } from '../../utils/upload';

describe('Animalsontroller', () => {
  let controller: AnimalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalsController],
      providers: [AnimalsService, UploadUtil, ...animalsProviders],
    }).compile();

    controller = module.get<AnimalsController>(AnimalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
