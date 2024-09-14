import {
  Controller,
  Post,
  Body,
  Patch,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import {
  ChangeEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './users.dto';
import { UserService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user.id;
    return this.userService.uploadAvatar(userId, file);
  }
}
