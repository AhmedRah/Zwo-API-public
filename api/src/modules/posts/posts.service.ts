import { Injectable, Inject } from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(@Inject('POST_REPOSITORY') private readonly postRepository: typeof Post) {}

  async create(post: PostDto, author): Promise<Post> {
    return await this.postRepository.create<Post>({ ...post, author });
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll<Post>({});
  }

  async findOne(id): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      attributes: {
        exclude: ['author'],
      },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async delete(id, author) {
    return await this.postRepository.destroy({ where: { id, author } });
  }

  async update(id, data, author) {
    const [numberOfAffectedRows, [updatedPost]] = await this.postRepository.update({ ...data }, { where: { id, author }, returning: true });

    return { numberOfAffectedRows, updatedPost };
  }
}
