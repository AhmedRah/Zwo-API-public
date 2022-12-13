import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { Animal } from './animal.entity';
import { AuthGuard } from '@nestjs/passport';
import { AnimalDto } from './dto/animal.dto';

@ApiTags('animals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('animals')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @Get()
  findAll(@Request() req): Promise<Animal[]> {
    return this.animalsService.findAll(req.user);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<Animal> {
    return this.animalsService.findOne(id, req.user);
  }

  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  create(@Body() animalDto: AnimalDto, @Request() req): Promise<Animal> {
    return this.animalsService.create(animalDto, req.user);
  }

  @HttpCode(204)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() animalDto: AnimalDto,
    @Request() req,
  ): Promise<void> {
    return this.animalsService.update(id, animalDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.animalsService.remove(id, req.user);
  }
}
