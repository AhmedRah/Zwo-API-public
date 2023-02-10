import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { postsProviders } from './posts.providers';
import { LikesModule } from './like/likes.module';
import { SharesModule } from './share/shares.module';
import { UploadUtil } from '../../utils/upload';

@Module({
  imports: [LikesModule, SharesModule],
  controllers: [PostsController],
  providers: [PostsService, UploadUtil, ...postsProviders],
  exports: [PostsService],
})
export class PostsModule {}
