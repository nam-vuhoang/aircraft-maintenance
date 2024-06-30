import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './import.controller';
import { Flight } from '../flight/flight.entity';
import { WorkPackage } from '../work-package/work-package.entity';
import { FlightService } from '../flight/flight.service';
import { WorkPackageService } from '../work-package/work-package.service';

@Module({
  imports: [TypeOrmModule.forFeature([Flight, WorkPackage])],
  controllers: [ImportController],
  providers: [FlightService, WorkPackageService],
})
export class ImportModule {}
