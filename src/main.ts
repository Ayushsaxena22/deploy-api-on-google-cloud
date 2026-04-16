import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // Bootstrap a hybrid app: HTTP for Postman and TCP for Nest microservice clients.
  const app = await NestFactory.create(AppModule);

  // Validate incoming HTTP and TCP payloads before they reach handlers.
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

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.MICROSERVICE_HOST ?? '127.0.0.1',
      port: Number(process.env.MICROSERVICE_PORT ?? 3001),
    },
  });

  await app.startAllMicroservices();
  await app.listen(Number(process.env.HTTP_PORT ?? 3000));
}

void bootstrap();
