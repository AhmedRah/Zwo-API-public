import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars/avatars.controller';
import { BackgroundsController } from './backgrounds/backgrounds.controller';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

import {
  USER_FOLLOWER_REPOSITORY,
  USER_REPOSITORY,
} from '../../core/constants';
@Module({
  controllers: [UsersController, AvatarsController, BackgroundsController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService, USER_FOLLOWER_REPOSITORY, USER_REPOSITORY],
})
export class UsersModule {}
