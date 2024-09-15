import {
  Controller,
  Post,
  Body,
  Patch,
  UseInterceptors,
  UseGuards,
  Req,
  Get,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  ChangeEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './users.dto';
import { UserService } from './users.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UploadFile } from 'src/shared/decorators/file-upload.decorator';
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  MAX_DOCS_COUNT,
  MAX_DOCS_SIZE,
} from 'src/shared/constants';
import { Errors } from 'src/shared/errors';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.sendPasswordResetEmail(forgotPasswordDto.email);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUser(@Req() req) {
    return this.userService.getUserById(req.user.id);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  @Patch('change-email')
  async changeEmail(@Body() changeEmailDto: ChangeEmailDto) {
    return this.userService.changeEmail(
      changeEmailDto.userId,
      changeEmailDto.newEmail,
    );
  }

  @Post('upload-avatar')
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  @UploadFile('files', MAX_DOCS_COUNT, {
    limits: { fileSize: MAX_DOCS_SIZE },
    fileFilter: (req, file, cb) => {
      if (!ALLOWED_DOCUMENT_MIME_TYPES.has(file.mimetype)) {
        return cb(new BadRequestException(Errors.invalidFileType), false);
      }

      return cb(null, true);
    },
  })
  async uploadAvatar(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.userService.uploadAvatar(userId, files[0]);
  }
}
