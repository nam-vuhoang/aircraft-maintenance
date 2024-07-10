import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import { LogLevel } from 'typeorm';

config({ path: path.resolve(__dirname, '../../.env') });

function validateEnvVariable(variable: string, variableName: string): string {
  if (!variable) {
    console.error(
      `Error: ${variableName} is not defined. Please set ${variableName} in your environment variables.`,
    );
    throw new Error(
      `Configuration error: ${variableName} is not defined. Please set ${variableName} in your environment variables.`,
    );
  }
  return variable;
}

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get the TypeORM log levels based on the base log level
 * @param baseLogLevel The base log level, e.g. 'debug', 'info', 'warn', 'error'
 * @returns An array of TypeORM log levels
 */
const getTypeORMLogLevels = (): LogLevel[] => {
  const baseLogLevel = process.env.LOG_LEVEL || 'info';

  // LogLevel = "query" | "schema" | "error" | "warn" | "info" | "log" | "migration"
  const logLevels: LogLevel[] = [];

  switch (baseLogLevel) {
    case 'debug':
      logLevels.push(
        'query',
        'schema',
        'error',
        'warn',
        'info',
        'log',
        'migration',
      );
      break;
    case 'info':
      logLevels.push('info', 'warn', 'error', 'log');
      break;
    case 'warn':
      logLevels.push('warn', 'error');
      break;
    case 'error':
      logLevels.push('error');
      break;
    default:
      logLevels.push('error', 'warn', 'info', 'log');
  }

  return logLevels;
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: validateEnvVariable(process.env.DATABASE_HOST, 'DATABASE_HOST'),
  port: parseInt(
    validateEnvVariable(process.env.DATABASE_PORT, 'DATABASE_PORT'),
    10,
  ),
  username: validateEnvVariable(process.env.DATABASE_USER, 'DATABASE_USER'),
  password: validateEnvVariable(
    process.env.DATABASE_PASSWORD,
    'DATABASE_PASSWORD',
  ),
  database: validateEnvVariable(process.env.DATABASE_NAME, 'DATABASE_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: !isProduction, // Only synchronize in development
  logging: getTypeORMLogLevels(),
};
