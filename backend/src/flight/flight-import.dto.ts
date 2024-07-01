import { IsString, IsDateString, IsOptional } from 'class-validator';
import { Flight } from './flight.entity';

export class FlightImportDto {
  @IsString()
  flightId: string;

  @IsString()
  airline: string;

  @IsString()
  registration: string;

  @IsString()
  aircraftType: string;

  @IsString()
  flightNum: string;

  @IsDateString()
  schedDepTime: string;

  @IsDateString()
  schedArrTime: string;

  @IsOptional()
  @IsDateString()
  actualDepTime?: string;

  @IsOptional()
  @IsDateString()
  actualArrTime?: string;

  @IsOptional()
  @IsDateString()
  estimatedDepTime?: string;

  @IsOptional()
  @IsDateString()
  estimatedArrTime?: string;

  @IsString()
  schedDepStation: string;

  @IsString()
  schedArrStation: string;

  @IsOptional()
  @IsString()
  depStand?: string;

  @IsOptional()
  @IsString()
  origDepStand?: string;

  @IsOptional()
  @IsString()
  arrStand?: string;

  @IsOptional()
  @IsString()
  origArrStand?: string;

  convertToFlightEntity(): Flight {
    const flight = new Flight();
    flight.id = this.flightId;
    flight.airline = this.airline;
    flight.registration = this.registration;
    flight.aircraftType = this.aircraftType;
    flight.flightNumber = this.flightNum;
    flight.scheduledDepartureTime = new Date(this.schedDepTime);
    flight.scheduledArrivalTime = new Date(this.schedArrTime);
    flight.actualDepartureTime =
      this.actualDepTime && new Date(this.actualDepTime);
    flight.actualArrivalTime =
      this.actualArrTime && new Date(this.actualArrTime);
    flight.estimatedDepartureTime =
      this.estimatedDepTime && new Date(this.estimatedDepTime);
    flight.estimatedArrivalTime =
      this.estimatedArrTime && new Date(this.estimatedArrTime);
    flight.scheduledDepartureStation = this.schedDepStation;
    flight.scheduledArrivalStation = this.schedArrStation;
    flight.departureStand = this.depStand;
    flight.originalDepartureStand = this.origDepStand;
    flight.arrivalStand = this.arrStand;
    flight.originalArrivalStand = this.origArrStand;
    return flight;
  }
}
