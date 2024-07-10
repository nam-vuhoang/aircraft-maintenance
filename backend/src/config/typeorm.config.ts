import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import * as path from 'path';

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
  logging: !isProduction, // Enable logging only in development
};
