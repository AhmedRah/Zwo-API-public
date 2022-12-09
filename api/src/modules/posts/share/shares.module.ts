import { Module } from '@nestjs/common';
import { SharesService } from './shares.service';
import { SharesController } from './shares.controller';
import { sharesProviders } from './shares.providers';
import { postsProviders } from '../posts.providers';
import { usersProviders } from '../../users/users.providers';

@Module({
  controllers: [SharesController],
  providers: [SharesService, ...sharesProviders, ...postsProviders, ...usersProviders],
})
export class SharesModule {}
