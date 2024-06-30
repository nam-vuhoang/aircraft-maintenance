import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightModule } from './flight/flight.module';
import { WorkPackageModule } from './work-package/work-package.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    FlightModule,
    WorkPackageModule,
    ImportModule,
  ],
})
export class AppModule {}
