import {
  ApiBadRequestResponse,
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
import { AuthGuard } from '@nestjs/passport';
import { AnimalDto } from './dto/animal.dto';
import { FileSizeValidationPipe } from '../../pipes/file-size-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('animals')
@UseGuards(AuthGuard('jwt'))
@Controller('animals')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalsService.findOne(id);
  }

  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseInterceptors(FileInterceptor('animalFile'))
  @HttpCode(201)
  @Post()
  create(
    @Request() req,
    @Body() animalDto: AnimalDto,
    @UploadedFile(new FileSizeValidationPipe())
    animalFile?: Express.Multer.File,
  ): Promise<void> {
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
