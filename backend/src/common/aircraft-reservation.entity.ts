import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export abstract class AircraftReservation {
  @Column()
  @ApiProperty({
    example: 'ABC123',
    description: 'The registration number of the aircraft',
  })
  registration: string;

  abstract get id(): string;
  abstract get startTime(): Date;
  abstract get endTime(): Date;
}
