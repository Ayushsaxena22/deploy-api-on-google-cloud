import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

let httpAppPromise: Promise<NestExpressApplication> | null = null;

async function bootstrapHttpApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.init();
  return app;
}

export function createHttpApp(): Promise<NestExpressApplication> {
  if (!httpAppPromise) {
    httpAppPromise = bootstrapHttpApp();
  }

  return httpAppPromise;
}