import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function UploadFile(
  fieldName: string = 'file',
  maxCount: number = 1,
  options?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(
      maxCount === 1
        ? FileInterceptor(fieldName, options)
        : FilesInterceptor(fieldName, maxCount, options),
    ),
  );
}
