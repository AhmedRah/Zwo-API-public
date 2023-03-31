import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { ValidationException } from '../../utils/error';
import { UserTypes } from './enums/user-types.enum';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const avatars = require('../../../data/avatars.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('../../../data/colors.json');

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(
    @Query('q') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.usersService.findAll(query, page, limit);
  }

  @Get(':id')
  async findProfile(@Req() req, @Param('id') id: string) {
    return this.usersService.findProfile(req.user.id, +id);
  }

  @HttpCode(204)
  @Patch('me')
  updateMe(@Req() req, @Body() userUpdateDto: UserUpdateDto) {
    const newData: any = {
      displayName: userUpdateDto.displayName,
      bio: userUpdateDto.bio,
    };

    if (userUpdateDto.avatarId) {
      // Search in file if avatar exists
      const avatar = avatars.data.find(
        (avatar: any) => avatar.id == userUpdateDto.avatarId,
      );
      if (!avatar) {
        throw new BadRequestException('Avatar not found');
      }
      newData.avatar = avatar.avatar;
    }

    if (userUpdateDto.avatarColorId) {
      // Search in file if color exists
      const color = colors.data.find(
        (color: any) => color.id == userUpdateDto.avatarColorId,
      );
      if (!color) {
        throw new BadRequestException('Color not found');
      }
      newData.avatarColor = color.color;
    }

    if ([UserTypes.COMPANY, UserTypes.ASSOCIATION].includes(req.user.type)) {
      newData.websiteURL = userUpdateDto.websiteURL;
    }

    if (req.user.type === UserTypes.ASSOCIATION) {
      newData.donationURL = userUpdateDto.donationURL;
    }

    return this.usersService
      .update(req.user.id, newData)
      .catch((e) => ValidationException(e));
  }

  @HttpCode(201)
  @Post('me/follow/:id')
  async follow(@Req() req, @Param('id') id: string) {
    return this.usersService.follow(req.user.id, +id);
  }

  @HttpCode(204)
  @Delete('me/unfollow/:id')
  async unfollow(@Req() req, @Param('id') id: string) {
    return this.usersService.unfollow(req.user.id, +id);
  }

  @Get(':id/followers')
  async findFollowers(@Param('id') id: string) {
    return this.usersService.findFollowers(+id);
  }

  @Get(':id/following')
  async findFollowing(@Param('id') id: string) {
    return this.usersService.findFollowing(+id);
  }

  @Get(':id/posts')
  async findPosts(@Param('id') id: string) {
    const posts = await this.usersService.findPosts(+id);
    return {
      ...posts.detailName,
      posts: posts.posts.map((p) => p.details),
    };
  }
}
