import {
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

  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  @Get(':id')
  async findProfile(@Req() req, @Param('id') id: string) {
    return this.usersService.findProfile(+id);
  }

  @HttpCode(204)
  @Patch('me')
  updateMe(@Req() req, @Body() userUpdateDto: UserUpdateDto) {
    return this.usersService
      .update(req.user.id, {
        displayName: userUpdateDto.displayName,
        bio: userUpdateDto.bio,
      })
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
}
