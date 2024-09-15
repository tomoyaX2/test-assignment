import {
  IsNumber,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

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
  @Min(15)
  @Max(60)
  expirationTime?: number;
}

export class GetRealLinkDto {
  shortLink: string;
}
