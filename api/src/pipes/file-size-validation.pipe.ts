import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  TYPE_ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value) return value;

    if (value.size > +process.env.MAX_IMAGE_SIZE) {
      throw new BadRequestException('File too large');
    }

    if (!this.TYPE_ALLOWED.includes(value.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }

    return value;
  }
}
