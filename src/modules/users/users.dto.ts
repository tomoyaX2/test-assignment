import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @IsStrongPassword()
  @MinLength(6)
  @MaxLength(100)
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
