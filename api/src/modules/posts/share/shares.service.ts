import { Injectable, Inject } from '@nestjs/common';
import { Share } from './share.entity';
import { SharesDto } from './dto/share.dto';

@Injectable()
export class SharesService {
  constructor(@Inject('SHARE_REPOSITORY') private readonly shareRepository: typeof Share) {}

  // get all shares
  async findAll(): Promise<Share[]> {
    return await this.shareRepository.findAll<Share>();
  }

  // get all shares for a post
  async findAllForPost(id: number): Promise<Share[]> {
    return await this.shareRepository.findAll({
      where: { post: id },
    });
  }

  // get all shares for a post
  async findAllForSelf(id: number): Promise<Share[]> {
    return await this.shareRepository.findAll({
      where: { author: id },
    });
  }

  // create new share
  async create(postShared, author): Promise<Share> {
    const share: SharesDto = { ...postShared, author };
    return await this.shareRepository.create<Share>(share);
  }

  // delete a share
  async delete(id, author) {
    return await this.shareRepository.destroy({ where: { post: id, author } });
  }
}
