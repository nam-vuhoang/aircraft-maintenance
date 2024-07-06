import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Enable CORS for development
  const configService = app.get(ConfigService);
  console.log('NODE_ENV:', configService.get<string>('NODE_ENV'));
  if (configService.get<string>('NODE_ENV') === 'development') {
    app.enableCors({
      origin: configService.get<string>('FRONTEND_URL'),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
  }

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable Swagger
  const config = new DocumentBuilder()
    .setTitle('Flight API')
    .setDescription('API documentation for the aircraft maintenance services')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Start the application
  await app.listen(3000);
}
bootstrap();
