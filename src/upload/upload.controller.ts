import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RestAuthGuard } from '../auth/rest-auth.guard';
import { UploadService } from './upload.service';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

function normalizeMimeType(mimetype: string): string {
  const m = mimetype.trim().toLowerCase();
  if (m === 'image/jpg') return 'image/jpeg';
  return m;
}

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseGuards(RestAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    console.log(
      'File received:',
      file.originalname,
      file.mimetype,
      file.size,
    );
    const mime = normalizeMimeType(file.mimetype ?? '');
    if (!ALLOWED_TYPES.includes(mime)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, WebP allowed',
      );
    }
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('File too large. Maximum 5MB allowed');
    }

    const url = await this.uploadService.uploadFile(file, 'uploads');
    return { url };
  }
}
