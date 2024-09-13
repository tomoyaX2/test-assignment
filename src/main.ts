import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const allowedOrigins = configService.get('ALLOWED_ORIGINS').split(',');

  app.setGlobalPrefix('api');
  app.enableCors({ origin: allowedOrigins, credentials: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (configService.get('SWAGGER')) {
    const config = new DocumentBuilder()
      .setTitle('MetaDialog')
      .setDescription('The MetaDialog API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const host = configService.get('HOST');
  const port = configService.get('PORT');

  const defaultLogger = app.get(Logger);

  await app.listen(port, host);
  defaultLogger.log(
    `Application is running on: ${await app.getUrl()}`,
    'bootstrap',
  );
}

bootstrap();
