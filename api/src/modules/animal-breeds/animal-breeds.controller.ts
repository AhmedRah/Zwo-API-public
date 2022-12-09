import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnimalBreedsService } from './animal-breeds.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('animals-breeds')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('animals/breeds')
export class AnimalBreedsController {
  constructor(private animalBreedsService: AnimalBreedsService) {}

  @ApiOperation({ summary: 'Get all animals types' })
  @Get('types')
  findTypes(): Promise<{ type: string; nbBreeds: number }[]> {
    return this.animalBreedsService.findTypes();
  }

  @ApiOperation({ summary: 'Get all breeds by type' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':type')
  findBreeds(@Param('type') type: string): Promise<string[]> {
    return this.animalBreedsService.findBreeds(type);
  }
}
