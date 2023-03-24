import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  me(@Req() req) {
    return req.user;
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
}
