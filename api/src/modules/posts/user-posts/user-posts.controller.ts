import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserPostsService } from './user-posts.service';

@ApiTags('user-posts')
@UseGuards(AuthGuard('jwt'))
@Controller('users/:id/posts')
export class UserPostsController {
  constructor(private readonly userPostsService: UserPostsService) {}

  @ApiQuery({
    name: 'type',
    schema: { type: 'string', default: 'all', enum: ['all', 'media'] },
  })
  @Get()
  findUserPosts(
    @Param('id') id: number,
    @Query('type') type: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.userPostsService.findUserPosts(id, type, page, limit);
  }
}
