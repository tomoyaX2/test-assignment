import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  Get,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  ChangeEmailDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './users.dto';
import { UserService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UploadFile } from 'src/shared/decorators/file-upload.decorator';
import { MAX_DOCS_COUNT, MAX_DOCS_SIZE } from 'src/shared/constants';
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

  @Post('set-password')
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

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    const userId = req.user?.id;

    const { oldPassword, newPassword } = changePasswordDto;

    const result = await this.userService.changePassword(
      userId,
      oldPassword,
      newPassword,
    );

    if (!result) {
      throw new BadRequestException(Errors.oldPasswordIsIncorrect);
    }
  }

  @Post('upload-avatar')
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @UploadFile('files', MAX_DOCS_COUNT, {
    limits: { fileSize: MAX_DOCS_SIZE },
    storage: memoryStorage(),
  })
  async uploadAvatar(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.userService.uploadAvatar(userId, files[0]);
  }
}
