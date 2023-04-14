import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { POST_REPOSITORY } from '../../../core/constants';
import { Post } from '../post.entity';
import { Op } from 'sequelize';
import { Like } from '../like/like.entity';

@Injectable()
export class UserPostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
    @Inject('LIKE_REPOSITORY') private readonly likeRepository: typeof Like,
  ) {}

  async findUserPosts(userId: number, type = 'all', page = 1, limit = 10) {
    // If type is not valid
    if (!['all', 'media', 'liked'].includes(type)) {
      throw new BadRequestException('type is not valid');
    }

    if (page < 1 || limit < 1 || limit > +process.env.MAX_PAGE_SIZE) {
      throw new BadRequestException();
    }

    const offset = (page - 1) * limit;

    const where = {
      parentId: null,
    };

    if (type === 'media') {
      where['postImage'] = { [Op.not]: null };
    }

    if (type === 'liked') {
      const likesId = await this.likeRepository.findAll({
        where: { author: userId },
      });

      where['id'] = { [Op.in]: likesId.map((like) => like.post) };
    }

    if (type !== 'liked') {
      where['author'] = userId;
    }

    const { count, rows } = await this.postRepository.findAndCountAll({
      include: ['user', 'children', 'likes'],
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
