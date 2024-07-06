import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightModule } from './flight/flight.module';
import { WorkPackageModule } from './work-package/work-package.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    FlightModule,
    WorkPackageModule,
  ],
})
export class AppModule {}
