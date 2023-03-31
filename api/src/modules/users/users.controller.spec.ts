import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ValidationException } from '../../utils/error';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserTypes } from './enums/user-types.enum';

import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

import { usersTest } from '../../../test/test.scenarios';
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [UsersModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = usersTest.findAll;
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.findAll('john', null, null)).toBe(result);
    });
  });

  describe('findProfile', () => {
    it('should return a user profile', async () => {
      const user = usersTest.findProfile;
      jest
        .spyOn(service, 'findProfile')
        .mockImplementation(() => Promise.resolve(user));

      expect(await controller.findProfile({ user: { id: 1 } }, '1')).toBe(user);
    });
  });

  describe('updateMe', () => {
    it('should update the current user', async () => {
      const userUpdateDto: UserUpdateDto = usersTest.updateMe.success;
      jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve());

      expect(
        await controller.updateMe(
          { user: { id: usersTest.updateMe.userId, type: UserTypes.USER } },
          userUpdateDto,
        ),
      ).toBeUndefined();
    });

    it('should throw a BadRequestException if avatar is not found', async () => {
      const userUpdateDto: UserUpdateDto = usersTest.updateMe.failed_avatar_id;
      jest.spyOn(service, 'update').mockImplementation(() => Promise.reject());

      await expect(
        controller.updateMe(
          { user: { id: usersTest.updateMe.userId, type: UserTypes.USER } },
          userUpdateDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a BadRequestException if color is not found', async () => {
      const userUpdateDto: UserUpdateDto =
        usersTest.updateMe.failed_avatar_color;
      jest.spyOn(service, 'update').mockImplementation(() => Promise.reject());

      await expect(
        controller.updateMe(
          { user: { id: usersTest.updateMe.userId, type: UserTypes.USER } },
          userUpdateDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should catch and handle a InternalServerErrorException', async () => {
      const userUpdateDto: UserUpdateDto = usersTest.updateMe.failed_validation;
      jest.spyOn(service, 'update').mockImplementation(() => Promise.reject());

      await expect(
        controller.updateMe(
          { user: { id: usersTest.updateMe.userId, type: UserTypes.USER } },
          userUpdateDto,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
