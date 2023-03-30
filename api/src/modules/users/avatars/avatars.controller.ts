import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetBase64Image } from '../../../utils/media';
import * as process from 'process';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const avatars = require('../../../../data/avatars.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('../../../../data/colors.json');

@ApiTags('avatars')
@UseGuards(AuthGuard('jwt'))
@Controller('avatars')
export class AvatarsController {
  @Get()
  findAll() {
    return avatars.data.map((avatar: any) => ({
      id: avatar.id,
      avatar: GetBase64Image(avatar.avatar, process.env.PATH_AVATAR),
    }));
  }

  @Get('colors')
  findAllColors() {
    return colors.data.map((color: any) => ({
      id: color.id,
      color: color.color,
    }));
  }
}
