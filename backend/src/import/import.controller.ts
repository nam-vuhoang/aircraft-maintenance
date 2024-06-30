import { Controller, Post, Body } from '@nestjs/common';
import { FlightService } from '../flight/flight.service';
import { WorkPackageService } from '../work-package/work-package.service';
import { ImportFlightDto } from './import-flight.dto';
import { ImportWorkPackageDto } from './import-work-package.dto';
import { Flight } from '../flight/flight.entity';
import { WorkPackage } from '../work-package/work-package.entity';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('import')
@Controller('import')
export class ImportController {
  constructor(
    private readonly flightService: FlightService,
    private readonly workPackageService: WorkPackageService,
  ) {}

  @Post('flights')
  @ApiOperation({ summary: 'Import flights from JSON' })
  @ApiBody({
    type: [ImportFlightDto],
    description: 'Array of flights to import',
  })
  async importFlights(
    @Body() importFlightsDto: ImportFlightDto[],
  ): Promise<{ imported: number }> {
    let count = 0;
    for (const flightDto of importFlightsDto) {
      const flight = this.convertToFlightEntity(flightDto);
      await this.flightService.create(flight);
      count++;
    }
    return { imported: count };
  }

  @Post('work-packages')
  @ApiOperation({ summary: 'Import work packages from JSON' })
  @ApiBody({
    type: [ImportWorkPackageDto],
    description: 'Array of work packages to import',
  })
  async importWorkPackages(
    @Body() importWorkPackagesDto: ImportWorkPackageDto[],
  ): Promise<{ imported: number }> {
    let count = 0;
    for (const workPackageDto of importWorkPackagesDto) {
      const workPackage = this.convertToWorkPackageEntity(workPackageDto);
      await this.workPackageService.create(workPackage);
      count++;
    }
    return { imported: count };
  }

  private convertToFlightEntity(importFlightDto: ImportFlightDto): Flight {
    const flight = new Flight();
    flight.id = importFlightDto.flightId;
    flight.airline = importFlightDto.airline;
    flight.registration = importFlightDto.registration;
    flight.aircraftType = importFlightDto.aircraftType;
    flight.flightNumber = importFlightDto.flightNum;
    flight.scheduledDepartureTime = new Date(importFlightDto.schedDepTime);
    flight.scheduledArrivalTime = new Date(importFlightDto.schedArrTime);
    flight.actualDepartureTime = importFlightDto.actualDepTime
      ? new Date(importFlightDto.actualDepTime)
      : null;
    flight.actualArrivalTime = importFlightDto.actualArrTime
      ? new Date(importFlightDto.actualArrTime)
      : null;
    flight.estimatedDepartureTime = importFlightDto.estimatedDepTime
      ? new Date(importFlightDto.estimatedDepTime)
      : null;
    flight.estimatedArrivalTime = importFlightDto.estimatedArrTime
      ? new Date(importFlightDto.estimatedArrTime)
      : null;
    flight.scheduledDepartureStation = importFlightDto.schedDepStation;
    flight.scheduledArrivalStation = importFlightDto.schedArrStation;
    flight.departureStand = importFlightDto.depStand;
    flight.arrivalStand = importFlightDto.arrStand;
    flight.originalDepartureStand = importFlightDto.origDepStand;
    flight.originalArrivalStand = importFlightDto.origArrStand;
    return flight;
  }

  private convertToWorkPackageEntity(
    importWorkPackageDto: ImportWorkPackageDto,
  ): WorkPackage {
    const workPackage = new WorkPackage();
    workPackage.id = importWorkPackageDto.workPackageId;
    workPackage.name = importWorkPackageDto.name;
    workPackage.station = importWorkPackageDto.station;
    workPackage.status = importWorkPackageDto.status;
    workPackage.area = importWorkPackageDto.area;
    workPackage.registration = importWorkPackageDto.registration;
    workPackage.startTime = new Date(importWorkPackageDto.startDateTime);
    workPackage.endTime = new Date(importWorkPackageDto.endDateTime);
    return workPackage;
  }
}
