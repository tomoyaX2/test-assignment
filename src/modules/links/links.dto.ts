import { IsNumber, IsUrl } from 'class-validator';

export class ConvertToShortLinkFreeDto {
  @IsUrl()
  url: string;
}

export class ConvertToShortLinkDto {
  @IsUrl()
  url: string;

  @IsNumber()
  live_time?: number;
}

export class GetRealLinkDto {
  @IsUrl()
  shortLink: string;
}
