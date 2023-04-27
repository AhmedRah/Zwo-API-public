import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FileSizeValidationPipe } from '../../pipes/file-size-validation.pipe';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animal.dto';
import { animalsTest } from '../../../test/test.scenarios';

jest.mock('./animals.service');

describe('AnimalsController', () => {
  let controller: AnimalsController;
  let service: AnimalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalsController],
      providers: [AnimalsService],
    }).compile();

    controller = module.get<AnimalsController>(AnimalsController);
    service = module.get<AnimalsService>(AnimalsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findOne', () => {
    it('should return the animal with the given id', async () => {
      const animal = animalsTest.findOne;
      const animal = { id: '1', name: 'Lion' };
      jest.spyOn(service, 'findOne').mockResolvedValue(animal);

      expect(await controller.findOne('1')).toBe(animal);
    });

    it('should throw a NotFoundException if no animal with the given id is found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const animalDto: AnimalDto = {
      name: 'Lion',
      type: 'Wild',
      age: 5,
    };

    const user = {
      id: '1',
      username: 'testuser',
    };

    const animalFile = {
      originalname: 'lion.jpg',
      size: 2000,
    } as Express.Multer.File;

    it('should create a new animal with the provided data', async () => {
      jest
        .spyOn(service, 'create')
        .mockResolvedValue({ id: '1', ...animalDto });

      expect(await controller.create({ user }, animalDto, animalFile)).toEqual({
        id: '1',
        ...animalDto,
      });
    });

    it('should throw a BadRequestException if the file size is too large', async () => {
      const tooLargeFile = {
        originalname: 'lion.jpg',
        size: 5000000, // 5MB
      } as Express.Multer.File;

      await expect(
        controller.create({ user }, animalDto, tooLargeFile),
      ).rejects.toThrow(BadRequestException);
    });

    it('should catch and handle a InternalServerErrorException', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error());

      await expect(
        controller.create({ user }, animalDto, animalFile),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});

// import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { Test, TestingModule } from '@nestjs/testing';
// import * as request from 'supertest';
// import { FileSizeValidationPipe } from '../../pipes/file-size-validation.pipe';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { AnimalsController } from './animals.controller';
// import { AnimalsService } from './animals.service';
// import { AnimalDto } from './dto/animal.dto';

// describe('AnimalsController', () => {
//   let app: INestApplication;
//   let animalsService: AnimalsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [UsersService],
//       imports: [UsersModule],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//     service = module.get<UsersService>(UsersService);
//   });

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AnimalsController],
//       providers: [AnimalsService],
//     })
//       .overrideGuard(AuthGuard('jwt'))
//       .useClass(JwtAuthGuard)
//       .compile();

//     app = module.createNestApplication();
//     app.useGlobalPipes(
//       new ValidationPipe({
//         whitelist: true,
//         transform: true,
//         forbidUnknownValues: true,
//         transformOptions: {
//           enableImplicitConversion: true,
//         },
//       }),
//     );
//     await app.init();

//     animalsService = module.get<AnimalsService>(AnimalsService);
//   });

//   afterEach(async () => {
//     await app.close();
//   });

//   describe('GET /animals/:id', () => {
//     it('should return animal details for a valid id', async () => {
//       const animal = {
//         id: '1',
//         name: 'Penny',
//         species: 'Dog',
//         age: 2,
//       };
//       jest
//         .spyOn(animalsService, 'findOne')
//         .mockImplementation(async () => animal);

//       const response = await request(app.getHttpServer())
//         .get('/animals/1')
//         .send();
//       expect(response.status).toBe(HttpStatus.OK);
//       expect(response.body).toMatchObject(animal);
//     });

//     it('should return 404 for an invalid id', async () => {
//       jest
//         .spyOn(animalsService, 'findOne')
//         .mockImplementation(async () => null);

//       const response = await request(app.getHttpServer())
//         .get('/animals/invalid-id')
//         .send();
//       expect(response.status).toBe(HttpStatus.NOT_FOUND);
//     });
//   });

//   describe('POST /animals', () => {
//     it('should create a new animal', async () => {
//       const animalDto: AnimalDto = {
//         name: 'Penny',
//         species: 'Dog',
//         age: 2,
//       };

//       const response = await request(app.getHttpServer())
//         .post('/animals')
//         .field('name', animalDto.name)
//         .field('species', animalDto.species)
//         .field('age', animalDto.age.toString())
//         .attach('animalFile', 'test/fixtures/test-image.jpg');

//       expect(response.status).toBe(HttpStatus.CREATED);
//       expect(response.body.name).toEqual(animalDto.name);
//       expect(response.body.species).toEqual(animalDto.species);
//       expect(response.body.age).toEqual(animalDto.age);
//     });

//     it('should return 400 for invalid input', async () => {
//       const response = await request(app.getHttpServer())
//         .post('/animals')
//         .field('name', '')
//         .field('species', '')
//         .field('age', 'invalid-age')
//         .attach('animalFile', 'test/fixtures/test-image.jpg');

//       expect(response.status).toBe(HttpStatus.BAD_REQUEST);
//     });
//   });
// });
