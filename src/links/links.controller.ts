import { Body, Controller, Get, Post } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './links.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  getLinks() {
    return this.linksService.getAllLinks();
  }

  @Post()
  createLink(@Body() data: CreateLinkDto) {
    return this.linksService.saveLink(data);
  }
}
