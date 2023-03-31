import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POST_REPOSITORY') private readonly postRepository: typeof Post,
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
    });
    return { rows, count };
  }

  async findOne(id): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
    });
  }

  async delete(id, author) {
    return await this.postRepository.destroy({ where: { id, author } });
  }

  async update(id, data, author) {
    const [numberOfAffectedRows, [updatedPost]] =
      await this.postRepository.update(
        { ...data },
        { where: { id, author }, returning: true },
      );

    return { numberOfAffectedRows, updatedPost };
  }
}
