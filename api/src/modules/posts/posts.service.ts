import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { Post } from './post.entity';
import { POST_REPOSITORY } from '../../core/constants';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
  ) {}

  async create(post: PostDto, author): Promise<Post> {
    return await this.postRepository.create<Post>({
      ...post,
      author,
    });
  }

  async findAll(page = 1, limit = 10): Promise<any> {
    if (page < 1 || limit < 1 || limit > +process.env.MAX_PAGE_SIZE) {
      throw new BadRequestException();
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await this.postRepository.findAndCountAll({
      offset,
      limit,
      include: 'user',
    });
    return { rows, count };
  }

  async findOne(id): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      include: 'user',
    });
  }

  async delete(id, author) {
    return await this.postRepository.destroy({ where: { id, author } });
  }
}
