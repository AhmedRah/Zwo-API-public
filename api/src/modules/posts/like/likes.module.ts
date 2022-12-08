import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { likesProviders } from './likes.providers';
import { postsProviders } from '../posts.providers';
import { usersProviders } from '../../users/users.providers';

@Module({
  controllers: [LikesController],
  providers: [LikesService, ...likesProviders, ...postsProviders, ...usersProviders],
})
export class LikesModule {}
