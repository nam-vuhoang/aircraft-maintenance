import {
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class FlightFilter {
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  flightNumbers?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  airlines?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  registrations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aircraftTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departureStations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  arrivalStations?: string[];

  @IsOptional()
  @IsNumber()
  limit?: number;
}
