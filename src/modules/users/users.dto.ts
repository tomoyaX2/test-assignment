import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(300)
  newPassword: string;
}

export class ChangeEmailDto {
  @IsString()
  userId: string;

  @IsEmail()
  @MinLength(1)
  @MaxLength(300)
  newEmail: string;
}

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(300)
  newPassword: string;
}
