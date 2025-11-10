import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/app.module';
import { ObjectIdToStringInterceptor } from './module/core/interceptors/objectid-to-string.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Middleware / pipes globales
  const isProduction = process.env.NODE_ENV === 'production';
  app.enableCors({
    origin: isProduction ? process.env.FRONTEND_URL : true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Convert any Mongo ObjectId instances in responses to hex-string automatically
  app.useGlobalInterceptors(new ObjectIdToStringInterceptor());

  await app.listen(3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
