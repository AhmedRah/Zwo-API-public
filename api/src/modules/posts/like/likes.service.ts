import { Injectable, Inject } from '@nestjs/common';
import { Like } from './like.entity';

@Injectable()
export class LikesService {
  constructor(
    @Inject('LIKE_REPOSITORY') private readonly likeRepository: typeof Like,
  ) {}

  // get all likes
  async findAll(): Promise<Like[]> {
    return await this.likeRepository.findAll<Like>();
  }

  // get all likes for a post
  async findAllForPost(id: number): Promise<Like[]> {
    return await this.likeRepository.findAll({
      where: { post: id },
    });
  }

  // get all likes for a post
  async findAllForSelf(id: number): Promise<Like[]> {
    return await this.likeRepository.findAll({
      where: { author: id },
    });
  }

  // create new like
  async create(postLiked, author) {
    const like = {
      post: postLiked.post,
      author,
    };
    return await this.likeRepository.upsert(like);
  }

  // delete a like
  async delete(id, author) {
    return await this.likeRepository.destroy({ where: { post: id, author } });
  }
}
