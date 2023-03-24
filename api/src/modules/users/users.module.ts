import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
