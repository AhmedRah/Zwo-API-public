import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import { join } from 'path';

export async function SaveImage(
  image: Express.Multer.File,
  dir: string,
): Promise<string> {
  const filename = uuid() + '.webp';

  await sharp(image.buffer).webp().toFile(path.join(dir, filename));

  return filename;
}

export function GetBase64Image(filename: string, dir?: string): string | null {
  const path = join(process.cwd(), dir, filename);

  // Check if file exists
  if (!fs.existsSync(path)) {
    return null;
  }

  const imageStream = fs.readFileSync(path);
  return imageStream.toString('base64');
}

export function DeleteFile(filename: string, dir: string): void {
  fs.unlink(path.join(dir, filename), () => {
    // Nothing to do
  });
}
