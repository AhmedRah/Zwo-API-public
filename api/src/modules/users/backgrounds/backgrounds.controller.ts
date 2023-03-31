import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetBase64Image } from '../../../utils/media';
import * as process from 'process';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const backgrounds = require('../../../../data/backgrounds.json');

@ApiTags('backgrounds')
@UseGuards(AuthGuard('jwt'))
@Controller('backgrounds')
export class BackgroundsController {
  @Get()
  findAll() {
    // Get 10 random backgrounds
    const randomBackgrounds = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * backgrounds.data.length);
      randomBackgrounds.push(backgrounds.data[randomIndex]);
    }
    return randomBackgrounds.map((bg: any) => ({
      id: bg.id,
      background: GetBase64Image(bg.background, process.env.PATH_BACKGROUND),
    }));
  }
}
