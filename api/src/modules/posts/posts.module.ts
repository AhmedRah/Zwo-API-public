import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { postsProviders } from './posts.providers';
import { LikesModule } from './like/likes.module';
import { SharesModule } from './share/shares.module';
import { UserPostsController } from './user-posts/user-posts.controller';
import { UserPostsService } from './user-posts/user-posts.service';

@Module({
  imports: [LikesModule, SharesModule],
  controllers: [PostsController, UserPostsController],
  providers: [PostsService, UserPostsService, ...postsProviders],
  exports: [PostsService],
})
export class PostsModule {}
