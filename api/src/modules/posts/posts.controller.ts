import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../../pipes/file-size-validation.pipe';
import { SaveImage } from '../../utils/media';
import { ValidationException } from '../../utils/error';
import { PostDto } from './dto/post.dto';

@ApiTags('posts')
@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @ApiQuery({
    name: 'parentId',
    required: false,
  })
  @Get()
  async findAll(
    @Request() req,
    @Query('parentId') parentId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.postService.findAll(req.user, parentId, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    // find the post with this id
    const post = await this.postService.findOne(id);

    // if the post doesn't exit in the db, throw a 404 error
    if (!post) {
      throw new NotFoundException("This Post doesn't exist");
    }
    return {
      ...post.details,
      author: post.user.detailName,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('postImage'))
  async create(
    @Request() req,
    @Body() postDto: PostDto,
    @UploadedFile(new FileSizeValidationPipe())
    postImages?: Express.Multer.File,
  ): Promise<any> {
    // Check if content or image is provided
    if (!postDto.content && !postImages) {
      throw new BadRequestException('content or postImage is required');
    }

    // If parent id is set, check if the post exists
    if (postDto.parentId) {
      const parentPost = await this.postService.findOne(postDto.parentId);
      if (!parentPost) {
        throw new BadRequestException('parentId is invalid');
      }
    }

    const postData = {
      parentId: postDto.parentId,
      content: postDto.content,
      postImage: postImages
        ? await SaveImage(postImages, process.env.UPLOAD_PATH_POSTS)
        : null,
    };

    try {
      const res = await this.postService.create(postData, req.user.id);
      return {
        id: res.id,
      };
    } catch (err) {
      ValidationException(err);
    }
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    await this.postService.delete(id, req.user.id);
  }
}
