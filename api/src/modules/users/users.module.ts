import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars/avatars.controller';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

import { Follower } from './followers/follower.entity';
import { User } from './user.entity';

import {
  USER_FOLLOWER_REPOSITORY,
  USER_REPOSITORY,
} from '../../core/constants';
@Module({
  controllers: [UsersController, AvatarsController],
  providers: [
    UsersService,
    ...usersProviders,
    // {
    //   provide: USER_REPOSITORY,
    //   useValue: User,
    // },
    // {
    //   provide: USER_FOLLOWER_REPOSITORY,
    //   useValue: Follower,
    // },
  ],
  exports: [UsersService, USER_FOLLOWER_REPOSITORY, USER_REPOSITORY],
})
export class UsersModule {}
