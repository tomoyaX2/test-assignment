import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import { Errors } from 'src/shared/errors';
import { MailService } from '../mail/mail.service';
import { generateResetToken } from 'src/shared/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(Errors.emailIsBusy);
    }
    const user = this.userRepository.create({ email });

    const resetToken = generateResetToken();
    user.reset_token = resetToken;

    await this.userRepository.save(user);
    await this.mailService.sendSetPasswordRequestEmail(user, resetToken);

    return this.createToken(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException(Errors.invalidCredentials);
    }

    return this.createToken(user);
  }

  private createToken(user: User): { access_token: string } {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
