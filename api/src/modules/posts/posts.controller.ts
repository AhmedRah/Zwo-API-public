import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';
import { Post as PostEntity } from './post.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../../pipes/file-size-validation.pipe';
import { UploadUtil } from '../../utils/upload';
import * as fs from 'fs';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly uploadUtil: UploadUtil,
  ) {}

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    // get all posts in the db
    return await this.postService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    // find the post with this id
    const post = await this.postService.findOne(id);

    // if the post doesn't exit in the db, throw a 404 error
    if (!post) {
      throw new NotFoundException("This Post doesn't exist");
    }
    // return post;
    const path = `${process.env.UPLOAD_PATH_ANIMALS}/${post.postImage}`;
    const imageStream = fs.readFileSync(path);
    const data = imageStream.toString('base64');
    // if post exist, return the post
    // post.postImage = imageStream;

    return data;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('postImage'))
  async create(
    @Request() req,
    @Body() bodyFormFields,
    @UploadedFile(new FileSizeValidationPipe())
    postImages?: Express.Multer.File,
  ): Promise<PostEntity> {
    // create a new post and return the newly created post
    const postData = {
      content: bodyFormFields.content,
      postImage: postImages
        ? await this.uploadUtil.saveImage(
            postImages,
            500,
            process.env.UPLOAD_PATH_ANIMALS,
          )
        : null,
    };
    return await this.postService.create(postData, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() post: PostDto,
    @Request() req,
  ): Promise<PostEntity> {
    // get the number of row affected and the updated post
    const { numberOfAffectedRows, updatedPost } = await this.postService.update(
      id,
      post,
      req.user.id,
    );

    // if the number of row affected is zero,
    // it means the post doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }

    // return the updated post
    return updatedPost;
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
