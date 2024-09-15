import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users.entity';
import { generateResetToken } from 'src/shared/utils';
import { MailService } from '../mail/mail.service';
import { Errors } from 'src/shared/errors';
import { S3Service } from '../s3/s3.service';
import * as _ from 'lodash';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly s3Service: S3Service,
  ) {}

  async getUserById(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(Errors.userNotFound);
    }

    return _.omit(user, ['password', 'reset_token']);
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(Errors.userNotFound);
    }

    const resetToken = generateResetToken();
    user.reset_token = resetToken;

    await this.userRepository.save(user);

    await this.mailService.sendSetPasswordRequestEmail(user, resetToken);
    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { reset_token: token },
    });

    if (!user) {
      throw new BadRequestException(Errors.invalidOrExpiredToken);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.reset_token = null;

    await this.userRepository.save(user);
    return { message: 'Password reset successful' };
  }

  async changeEmail(userId: string, newEmail: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(Errors.userNotFound);
    }

    user.email = newEmail;
    await this.userRepository.save(user);

    return { message: 'Email updated successfully' };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException(Errors.userNotFound);
    }

    if (user.password) {
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password,
      );

      if (!isOldPasswordValid) {
        return false;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedNewPassword;

    await this.userRepository.save(user);

    return true;
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const avatarUrl = await this.s3Service.uploadUserAvatar(file, user.id);

    user.avatar_url = avatarUrl;
    await this.userRepository.save(user);

    return avatarUrl;
  }
}
