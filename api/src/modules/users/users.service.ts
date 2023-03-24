import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';
import { UserUpdateDto } from './dto/user-update.dto';
import * as process from 'process';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async update(id: number, user: UserUpdateDto): Promise<void> {
    await this.userRepository.update(user, { where: { id } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { username } });
  }

  async findAll(
    query: string,
    page = 1,
    limit = 20,
  ): Promise<{ rows: User[]; count: number }> {
    if (page < 1 || limit < 1 || limit > +process.env.MAX_PAGE_SIZE) {
      throw new BadRequestException();
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await this.userRepository.findAndCountAll({
      attributes: ['id', 'username', 'displayName'],
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

    return { rows, count };
  }
}
