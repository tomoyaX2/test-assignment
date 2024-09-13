import { Injectable } from '@nestjs/common';
import { CreateLinkDto, LinkDto } from './links.dto';
import { Link } from './link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<LinkDto>,
  ) {}
  getAllLinks = () => {
    return [];
  };

  saveLink = (data: CreateLinkDto) => {
    // const newLink = await this.linksRepository.create({real_link})
    return data;
  };

  deleteLink = () => {};
}
