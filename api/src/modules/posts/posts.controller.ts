import {
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
import { ApiTags } from '@nestjs/swagger';
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

  @Get()
  async findAll(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.postService.findAll(req.user, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    // find the post with this id
    const post = await this.postService.findOne(id);

    // if the post doesn't exit in the db, throw a 404 error
    if (!post) {
      throw new NotFoundException("This Post doesn't exist");
    }

    return post.details;
  }

  @HttpCode(201)
  @Post()
  @UseInterceptors(FileInterceptor('postImage'))
  async create(
    @Request() req,
    @Body() postDto: PostDto,
    @UploadedFile(new FileSizeValidationPipe())
    postImages?: Express.Multer.File,
  ): Promise<any> {
    // create a new post and return the newly created post
    const postData = {
      content: postDto.content,
      postImage: postImages
        ? await SaveImage(postImages, process.env.UPLOAD_PATH_POSTS)
        : null,
    };
    await this.postService
      .create(postData, req.user.id)
      .catch((err) => ValidationException(err));
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    await this.postService.delete(id, req.user.id);
  }
}
