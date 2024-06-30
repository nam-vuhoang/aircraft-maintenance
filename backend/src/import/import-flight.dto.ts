import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportFlightDto {
  @ApiProperty({
    example: '007f78fb-2586-432a-a952-d19d63e18cc2',
    description: 'The unique identifier of the flight (UUID)',
  })
  @IsString()
  flightId: string;

  @ApiProperty({
    example: 'QO',
    description: 'The airline code of the flight',
  })
  @IsString()
  airline: string;

  @ApiProperty({
    example: 'ABA',
    description: 'The registration number of the flight',
  })
  @IsString()
  registration: string;

  @ApiProperty({
    example: 'AT7',
    description: 'The aircraft type of the flight',
  })
  @IsString()
  aircraftType: string;

  @ApiProperty({
    example: '8929',
    description: 'The flight number',
  })
  @IsString()
  flightNum: string;

  @ApiProperty({
    example: '2024-04-17T04:45:00.000Z',
    description: 'The scheduled departure time',
  })
  @IsDateString()
  schedDepTime: string;

  @ApiProperty({
    example: '2024-04-17T05:55:00.000Z',
    description: 'The scheduled arrival time',
  })
  @IsDateString()
  schedArrTime: string;

  @ApiProperty({
    example: '2024-04-17T04:45:00.000Z',
    description: 'The actual departure time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  actualDepTime?: string;

  @ApiProperty({
    example: '2024-04-17T05:49:00.000Z',
    description: 'The actual arrival time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  actualArrTime?: string;

  @ApiProperty({
    example: '2024-04-17T04:45:00.000Z',
    description: 'The estimated departure time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  estimatedDepTime?: string;

  @ApiProperty({
    example: '2024-04-17T05:49:00.000Z',
    description: 'The estimated arrival time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  estimatedArrTime?: string;

  @ApiProperty({
    example: 'HEL',
    description: 'The scheduled departure station',
  })
  @IsString()
  schedDepStation: string;

  @ApiProperty({
    example: 'RIX',
    description: 'The scheduled arrival station',
  })
  @IsString()
  schedArrStation: string;

  @ApiProperty({
    example: 'C5',
    description: 'The departure stand of the flight',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  depStand?: string;

  @ApiProperty({
    example: 'A1',
    description: 'The original departure stand of the flight',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  origDepStand?: string;

  @ApiProperty({
    example: 'B2',
    description: 'The arrival stand of the flight',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  arrStand?: string;

  @ApiProperty({
    example: 'B2',
    description: 'The original arrival stand of the flight',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  origArrStand?: string;
}
