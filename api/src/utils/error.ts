import { BadRequestException } from '@nestjs/common';

export function ValidationException(e: any) {
  if (!e.errors) {
    throw new BadRequestException();
  }
  throw new BadRequestException([
    (e.errors || []).map((e) => e.path + ' not valid'),
  ]);
}
