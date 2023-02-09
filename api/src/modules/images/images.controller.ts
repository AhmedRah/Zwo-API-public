import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ImagesService } from './images.service';

@ApiTags('images')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('images')
export class ImagesController {
  constructor(private animalsService: ImagesService) {}

  /**
   * Example of the route use:
   *
   * /images/users/1/example.wepb
   * /images/animals/1/example.wepb
   * /images/posts/1/example.wepb
   */

  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':type/:id/:imagePath')
  findOne(
    @Res({ passthrough: true }) res: Response,
    @Param('type') type: string,
    @Param('id') id: string,
    @Param('imagePath') imagePath: string,
  ): Promise<StreamableFile> {
    return this.animalsService.findImage(res, type, id, imagePath);
  }
}
