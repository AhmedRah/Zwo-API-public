import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { UsersController } from './users.controller';
import { AvatarsController } from './avatars/avatars.controller';
import { BackgroundsController } from './backgrounds/backgrounds.controller';

@Module({
  controllers: [UsersController, AvatarsController, BackgroundsController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
