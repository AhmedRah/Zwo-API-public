import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { POST_REPOSITORY } from '../../../core/constants';
import { Post } from '../post.entity';
import { Op } from 'sequelize';

@Injectable()
export class UserPostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
  ) {}

  async findUserPosts(userId: number, type = 'all', page = 1, limit = 10) {
    // If type is not 'all' or 'media', throw a bad request exception
    if (type !== 'all' && type !== 'media') {
      throw new BadRequestException('type is not valid');
    }

    if (page < 1 || limit < 1 || limit > +process.env.MAX_PAGE_SIZE) {
      throw new BadRequestException();
    }

    const offset = (page - 1) * limit;

    const where = {
      author: userId,
      parentId: null,
    };

    if (type === 'media') {
      where['postImage'] = { [Op.not]: null };
    }

    const { count, rows } = await this.postRepository.findAndCountAll({
      include: ['user', 'children'],
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    return {
      rows: rows.map((post) => ({
        ...post.details,
        author: post.user.detailName,
      })),
      count,
    };
  }
}
