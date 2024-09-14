import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import {
  ConvertToShortLinkDto,
  ConvertToShortLinkFreeDto,
  GetRealLinkDto,
} from './links.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  getLinks() {
    return this.linksService.getAllLinks();
  }

  @Post('free/convert')
  createFreeLink(@Body() data: ConvertToShortLinkFreeDto) {
    return this.linksService.convertToShort(data, null);
  }

  @Post('auth/convert')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createLink(@Body() data: ConvertToShortLinkDto, @Req() req) {
    return this.linksService.convertToShort(data, req.user.id);
  }

  @Post('real')
  @ApiOperation({ summary: 'Convert short link to normal' })
  @ApiResponse({ status: 404, description: 'Not valid or expired link' })
  getRealLink(@Body() body: GetRealLinkDto) {
    return this.linksService.getLink(body);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  softDeleteExpiredLinks() {
    this.linksService.softDeleteExpiredLinks();
  }

  @Cron(CronExpression.EVERY_WEEK)
  deleteExpiredLinks() {
    this.linksService.deleteExpiredLinks();
  }
}
