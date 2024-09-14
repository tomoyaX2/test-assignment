import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConvertToShortLinkDto, GetRealLinkDto } from './links.dto';
import { Link } from './link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Not, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  addMinutes,
  generateRandomString,
  subtractDays,
} from 'src/shared/utils';
import { Errors } from 'src/shared/errors';
import { User } from '../users/users.entity';

@Injectable()
export class LinksService {
  logger = new Logger(LinksService.name);

  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAllLinks = async () => {
    try {
      return await this.linksRepository.find();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  };

  generateShortLink = () => {
    try {
      const linkConsumerUrl = this.configService.get('CLIENT_URL');
      const shortLinkHash = generateRandomString();
      return `${linkConsumerUrl}#/s/${shortLinkHash}`;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  };

  convertToShort = async (data: ConvertToShortLinkDto, userId: string) => {
    try {
      let user = null;

      if (userId) {
        user = await this.userRepository.findOne({ where: { id: userId } });
      }

      const real_link = data.url;
      const short_link = this.generateShortLink();

      const existingShortLink = await this.linksRepository.findOne({
        where: { short_link },
      });

      if (existingShortLink) {
        return this.convertToShort(data, userId);
      }

      const expirationTimeMinutes = this.configService.get(
        'LINK_EXPIRATION_TIME_MINUTES',
      );

      const expiration_date =
        userId && data.live_time
          ? addMinutes(new Date(), data.live_time)
          : addMinutes(new Date(), parseInt(expirationTimeMinutes));

      const newLink = await this.linksRepository.save({
        real_link,
        short_link,
        expiration_date,
        created_date: new Date(),
        updated_date: new Date(),
        user,
      });

      return newLink;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  };

  getLinkByShortVersion = async ({ url }: { url: string }) => {
    try {
      const link = await this.linksRepository.findOne({
        where: { short_link: url, deleted_date: null },
      });
      if (!link) {
        throw new BadRequestException(Errors.notValidOrExpiredLink);
      }

      return link;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  };

  softDeleteExpiredLinks = async () => {
    try {
      const allExpiredLinks = await this.linksRepository.find({
        where: {
          expiration_date: LessThanOrEqual(new Date()),
        },
      });

      await this.linksRepository.softRemove(allExpiredLinks);
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error);
    }
  };

  deleteExpiredLinks = async () => {
    try {
      const allExpiredLinks = await this.linksRepository.find({
        where: {
          expiration_date: LessThanOrEqual(subtractDays(new Date(), 1)),
          deleted_date: Not(null),
        },
      });

      await this.linksRepository.remove(allExpiredLinks);
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error);
    }
  };

  getLink = async (data: GetRealLinkDto) => {
    try {
      const linkConsumerUrl = this.configService.get('CLIENT_URL');
      const short_link = data.shortLink.startsWith('https://')
        ? data.shortLink
        : `${linkConsumerUrl}#/s/${data.shortLink}`;
      const link = await this.linksRepository.findOne({
        where: {
          short_link,
          deleted_date: null,
        },
      });
      if (!link) {
        throw new BadRequestException(Errors.notValidOrExpiredLink);
      }

      return link;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  };
}
