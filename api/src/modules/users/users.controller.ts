import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
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

  @Get('me')
  me(@Req() req) {
    return req.user;
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

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const user = await this.usersService.findOneById(+id);
    if (!user) {
      throw new NotFoundException();
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
    };
  }

  @Get()
  findAll(
    @Query('q') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.usersService.findAll(query, page, limit);
  }
}
