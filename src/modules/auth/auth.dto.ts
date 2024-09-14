import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MinLength(1)
  @MaxLength(2000)
  email: string;
}

export class LoginUserDto {
  @IsEmail()
  @MinLength(1)
  @MaxLength(2000)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(2000)
  password: string;
}
