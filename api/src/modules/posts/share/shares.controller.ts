import { Controller, Get, Post, Delete, Param, Body, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Share as ShareEntity } from './share.entity';
import { SharesService } from './shares.service';

@Controller('shares')
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  // get all shares
  @Get()
  async findAll() {
    // get all shares in the db
    return await this.sharesService.findAll();
  }

  // get all shares for self
  @UseGuards(AuthGuard('jwt'))
  @Get('self')
  async findAllForSelf(@Request() req) {
    const shares = await this.sharesService.findAllForSelf(req.user.id);
    // if the post doesn't exit in the db, throw a 404 error
    if (!shares) {
      throw new NotFoundException("This Post doesn't exist");
    }
    return shares;
  }

  // get all shares for a post
  @Get(':id')
  async findAllForPost(@Param('id') id: number) {
    const shares = await this.sharesService.findAllForPost(id);
    // if the post doesn't exit in the db, throw a 404 error
    if (!shares) {
      throw new NotFoundException("This Post doesn't exist");
    }
    return shares;
  }

  // share a post
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() postShared, @Request() req): Promise<ShareEntity> {
    return await this.sharesService.create(postShared, req.user.id);
  }

  // unshared a post
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    // delete the post with this id
    const deleted = await this.sharesService.delete(id, req.user.id);

    // if the number of row affected is zero,
    // it means the post doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
