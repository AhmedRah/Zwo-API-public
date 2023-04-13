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
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service';
import { ApiTags } from '@nestjs/swagger';
import { LikesDto } from './dto/like.dto';
import { ValidationException } from '../../../utils/error';

@UseGuards(AuthGuard('jwt'))
@ApiTags('posts-likes')
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
  @HttpCode(201)
  @Post()
  async create(@Body() postLiked: LikesDto, @Request() req) {
    try {
      await this.likeService.create(postLiked, req.user.id);
    } catch (err) {
      ValidationException(err);
    }
  }

  // unlike a post
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    await this.likeService.delete(id, req.user.id);
  }
}
