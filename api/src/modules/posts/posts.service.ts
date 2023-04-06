import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Op } from 'sequelize';
import { PostDto } from './dto/post.dto';
import { Post } from './post.entity';
import { POST_REPOSITORY, USER_REPOSITORY } from '../../core/constants';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(post: PostDto, author): Promise<Post> {
    return await this.postRepository.create<Post>({
      ...post,
      author,
    });
  }

  async findAll(user, page = 1, limit = 10): Promise<any> {
    if (page < 1 || limit < 1 || limit > +process.env.MAX_PAGE_SIZE) {
      throw new BadRequestException();
    }

    const offset = (page - 1) * limit;

    // Get user's following ids
    const followings = await this.userRepository.findAll({
      attributes: ['id'],
      where: {
        '$followers.followerId$': user.id,
      },
      include: 'followers',
    });

    const { count, rows } = await this.postRepository.findAndCountAll({
      where: {
        author: {
          [Op.in]: [user.id, ...followings.map((user) => user.id)],
        },
      },
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
