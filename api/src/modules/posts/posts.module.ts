import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { postsProviders } from './posts.providers';
import { LikesModule } from './like/likes.module';

@Module({
  imports: [LikesModule],
  controllers: [PostsController],
  providers: [PostsService, ...postsProviders],
})
export class PostsModule {}
