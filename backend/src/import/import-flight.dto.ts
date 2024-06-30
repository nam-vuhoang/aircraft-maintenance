import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object (DTO) with the properties to import a flight.
 */
export class ImportFlightDto {
  @ApiProperty()
  @IsString()
  flightId: string;

  @ApiProperty()
  @IsString()
  airline: string;

  @ApiProperty()
  @IsString()
  registration: string;

  @ApiProperty()
  @IsString()
  aircraftType: string;

  @ApiProperty()
  @IsString()
  flightNum: string;

  @ApiProperty()
  @IsDateString()
  schedDepTime: string;

  @ApiProperty()
  @IsDateString()
  schedArrTime: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  actualDepTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  actualArrTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  estimatedDepTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  estimatedArrTime?: string;

  @ApiProperty()
  @IsString()
  schedDepStation: string;

  @ApiProperty()
  @IsString()
  schedArrStation: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  depStand?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  origDepStand?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  arrStand?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  origArrStand?: string;
}
