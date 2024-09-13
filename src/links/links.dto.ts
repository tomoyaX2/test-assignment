import { IsUrl } from 'class-validator';

export class LinkDto {
  id: string;

  real_link: string;

  short_link: string;
}

export class CreateLinkDto {
  @IsUrl()
  url: string;
}
