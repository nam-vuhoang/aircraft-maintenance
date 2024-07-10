import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Get the log levels based on the base log level
 * @param baseLogLevel The base log level, e.g. 'debug', 'info', 'warn', 'error'
 * @returns
 */
const getNestLogLevels = (baseLogLevel: string): LogLevel[] => {
  // https://docs.nestjs.com/techniques/logger
  // type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';
  const logLevels: LogLevel[] = [];

  switch (baseLogLevel) {
    case 'debug':
      logLevels.push('debug', 'log', 'warn', 'error', 'verbose');
      break;
    case 'info':
      logLevels.push('log', 'warn', 'error');
      break;
    case 'warn':
      logLevels.push('warn', 'error');
      break;
    case 'error':
      logLevels.push('error');
      break;
    default:
      logLevels.push('log', 'warn', 'error');
  }

  return logLevels;
};

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Enable logging
  const logLevel = process.env.LOG_LEVEL || 'info';
  app.useLogger(getNestLogLevels(logLevel));

  const logger = new Logger('bootstrap');
  logger.log('Logger level:', logLevel);

  // Enable CORS for frontend URL
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  logger.log(`Enabling CORS for frontend URL: ${frontendUrl}`);
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

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
  logger.log('Swagger documentation available at /api-docs');

  // Start the application
  await app.listen(3000);
}
bootstrap();
