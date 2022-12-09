import { Injectable, Inject } from '@nestjs/common';
import { Like } from './like.entity';
import { LikesDto } from './dto/like.dto';

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
  async create(postLiked, author): Promise<Like> {
    const like: LikesDto = { ...postLiked, author };
    return await this.likeRepository.create<Like>(like);
  }

  // delete a like
  async delete(id, author) {
    return await this.likeRepository.destroy({ where: { post: id, author } });
  }
}
