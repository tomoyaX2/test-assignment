import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  newPassword: string;
}

export class ChangeEmailDto {
  @IsString()
  userId: string;

  @IsEmail()
  newEmail: string;
}
