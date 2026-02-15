import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://petite-epouvante-frontend.azurewebsites.net',
      ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`La Petite Maison de l'Épouvante API est démarrée sur le port ${port}`);
}

bootstrap();
