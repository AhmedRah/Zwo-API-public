import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { Animal } from './animal.entity';
import { AuthGuard } from '@nestjs/passport';
import { AnimalDto } from './dto/animal.dto';
import { FileSizeValidationPipe } from '../../pipes/file-size-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

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
  findOne(@Request() req, @Param('id') id: string): Promise<Animal> {
    return this.animalsService.findOne(id, req.user);
  }

  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseInterceptors(FileInterceptor('animalFile'))
  @Post()
  create(
    @Request() req,
    @Body() animalDto: AnimalDto,
    @UploadedFile(new FileSizeValidationPipe())
    animalFile?: Express.Multer.File,
  ): Promise<Animal> {
    return this.animalsService.create(animalDto, req.user, animalFile);
  }

  @UseInterceptors(FileInterceptor('animalFile'))
  @HttpCode(204)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() animalDto: AnimalDto,
    @UploadedFile(new FileSizeValidationPipe())
    animalFile?: Express.Multer.File,
  ): Promise<void> {
    return this.animalsService.update(id, animalDto, req.user, animalFile);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string): Promise<void> {
    return this.animalsService.remove(id, req.user);
  }
}
