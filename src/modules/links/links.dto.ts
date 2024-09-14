import { IsNumber, IsUrl, MaxLength, MinLength } from 'class-validator';

export class ConvertToShortLinkFreeDto {
  @IsUrl()
  @MinLength(1)
  @MaxLength(2000)
  url: string;
}

export class ConvertToShortLinkDto {
  @IsUrl()
  @MinLength(1)
  @MaxLength(2000)
  url: string;

  @IsNumber()
  @MinLength(1)
  @MaxLength(2000)
  live_time?: number;
}

export class GetRealLinkDto {
  shortLink: string;
}
