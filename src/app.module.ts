import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinksModule } from './modules/links/links.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from './modules/users/users.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Link } from './modules/links/link.entity';
import * as fs from 'fs';
import { UserModule } from './modules/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailModule } from './modules/mail/mail.module';
import { S3Module } from './modules/s3/s3.module';

@Module({
  imports: [
    LinksModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [User, Link],
        synchronize: true,
        ssl: {
          ca: process.env.SSL_CERT || fs.readFileSync('ca-certificate.crt'),
        },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: `smtps://${configService.get('EMAIL_USER')}:${configService.get('EMAIL_PASSWORD')}@smtp.gmail.com`,
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: 'templates',
          adapter: new EjsAdapter(),
        },
      }),
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    UserModule,
    MailModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
