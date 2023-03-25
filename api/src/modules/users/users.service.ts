import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Follower } from './followers/follower.entity';
import { UserDto } from './dto/user.dto';
import {
  USER_FOLLOWER_REPOSITORY,
  USER_REPOSITORY,
} from '../../core/constants';
import * as process from 'process';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(USER_FOLLOWER_REPOSITORY)
    private readonly userFollowerRepository: typeof Follower,
  ) {}

  async create(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async update(id: number, user: any): Promise<void> {
    await this.userRepository.update(user, { where: { id } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { username } });
  }

  async findAll(query: string, page = 1, limit = 20) {
    if (page < 1 || limit < 1 || limit > +process.env.MAX_PAGE_SIZE) {
      throw new BadRequestException();
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await this.userRepository.findAndCountAll({
      where: {
        [Op.or]: [
          {
            displayName: {
              [Op.iLike]: `${query}%`,
            },
          },
          {
            username: {
              [Op.iLike]: `${query}%`,
            },
          },
        ],
      },
      offset,
      limit,
    });

    return {
      rows: rows.map((u) => u.detailName),
      count,
    };
  }

  async findProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      include: ['followers', 'following', 'animals'],
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user.profile;
  }

  async follow(userId: number, followingId: number) {
    if (userId === followingId) {
      throw new BadRequestException();
    }

    try {
      await this.userFollowerRepository.findOrCreate({
        where: { followerId: userId, followingId: followingId },
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async unfollow(userId: number, followingId: number) {
    try {
      await this.userFollowerRepository.destroy({
        where: { followerId: userId, followingId: followingId },
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async findFollowers(id: number) {
    const followers = await this.userRepository.findAll({
      where: {
        '$followers.followingId$': id,
      },
      include: 'followers',
    });

    return followers.map((f) => f.detailName);
  }

  async findFollowing(id: number) {
    const following = await this.userRepository.findAll({
      where: {
        '$following.followerId$': id,
      },
      include: 'following',
    });

    return following.map((f) => f.detailName);
  }
}
