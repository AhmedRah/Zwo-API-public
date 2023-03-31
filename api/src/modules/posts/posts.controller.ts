import {
  Body,
  Controller,
  Delete,
  Get,
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
import { Post as PostEntity } from './post.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../../pipes/file-size-validation.pipe';
import { SaveImage } from '../../utils/media';

import { ValidationException } from '../../utils/error';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    // get all posts in the db
    const posts = await this.postService.findAll(page, limit);

    if (posts.rows.length === 0) {
      throw new NotFoundException('No posts found');
    }

    return posts.rows.map((post) => ({
      ...post.details,
      author: post.user.detailName,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    // find the post with this id
    const post = await this.postService.findOne(id);

    // if the post doesn't exit in the db, throw a 404 error
    if (!post) {
      throw new NotFoundException("This Post doesn't exist");
    }
    return { ...post.details, author: post.user.detailName };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('postImage'))
  async create(
    @Request() req,
    @Body() bodyFormFields,
    @UploadedFile(new FileSizeValidationPipe())
    postImages?: Express.Multer.File,
  ): Promise<PostEntity | void> {
    // create a new post and return the newly created post
    const postData = {
      content: bodyFormFields.content,
      postImage: postImages
        ? await SaveImage(postImages, 500, process.env.UPLOAD_PATH_POSTS)
        : null,
    };
    return await this.postService
      .create(postData, req.user.id)
      .catch((err) => ValidationException(err));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    // delete the post with this id
    const deleted = await this.postService.delete(id, req.user.id);

    // if the number of row affected is zero,
    // then the post doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
