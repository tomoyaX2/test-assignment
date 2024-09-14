import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MailModule } from '../mail/mail.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    MailModule,
    S3Module,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
