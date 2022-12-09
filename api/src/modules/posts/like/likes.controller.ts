import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Like as LikeEntity } from './like.entity';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likeService: LikesService) {}

  // get all likes
  @Get()
  async findAll() {
    // get all likes in the db
    return await this.likeService.findAll();
  }

  // get all likes for self
  @UseGuards(AuthGuard('jwt'))
  @Get('self')
  async findAllForSelf(@Request() req) {
    const likes = await this.likeService.findAllForSelf(req.user.id);
    // if the post doesn't exit in the db, throw a 404 error
    if (!likes) {
      throw new NotFoundException("This Post doesn't exist");
    }
    return likes;
  }

  // get all likes for a post
  @Get(':id')
  async findAllForPost(@Param('id') id: number) {
    const likes = await this.likeService.findAllForPost(id);
    // if the post doesn't exit in the db, throw a 404 error
    if (!likes) {
      throw new NotFoundException("This Post doesn't exist");
    }
    return likes;
  }

  // like a post
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() postLiked, @Request() req): Promise<LikeEntity> {
    return await this.likeService.create(postLiked, req.user.id);
  }

  // unlike a post
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    // delete the post with this id
    const deleted = await this.likeService.delete(id, req.user.id);

    // if the number of row affected is zero,
    // it means the post doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
