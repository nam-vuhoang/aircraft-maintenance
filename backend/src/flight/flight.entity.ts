import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDurationEntity } from '../common/base-duration.entity';

@Entity('flights')
export class Flight extends BaseDurationEntity {
  @Column()
  @ApiProperty({
    example: 'QO',
    description: 'The airline code of the flight',
  })
  airline: string;

  @Column()
  @ApiProperty({
    example: 'ABA',
    description: 'The registration number of the flight',
  })
  registration: string;

  @Column()
  @ApiProperty({
    example: 'AT7',
    description: 'The aircraft type of the flight',
  })
  aircraftType: string;

  @Column()
  @ApiProperty({
    example: '8929',
    description: 'The flight number',
  })
  flightNumber: string;

  @Column({ name: 'scheduled_departure_station' })
  @ApiProperty({
    example: 'HEL',
    description: 'The scheduled departure station',
  })
  scheduledDepartureStation: string;

  @Column({ name: 'scheduled_arrival_station' })
  @ApiProperty({
    example: 'RIX',
    description: 'The scheduled arrival station',
  })
  scheduledArrivalStation: string;

  @Column({ name: 'scheduled_departure_time', type: 'timestamp' })
  @ApiProperty({
    example: '2024-04-17T04:45:00.000Z',
    description: 'The scheduled departure time',
  })
  scheduledDepartureTime: Date;

  @Column({ name: 'scheduled_arrival_time', type: 'timestamp' })
  @ApiProperty({
    example: '2024-04-17T05:55:00.000Z',
    description: 'The scheduled arrival time',
  })
  scheduledArrivalTime: Date;

  @Column({
    name: 'estimated_departure_time',
    type: 'timestamp',
    nullable: true,
  })
  @ApiProperty({
    example: '2024-04-17T04:45:00.000Z',
    description: 'The estimated departure time',
    nullable: true,
  })
  estimatedDepartureTime: Date;

  @Column({ name: 'estimated_arrival_time', type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2024-04-17T05:49:00.000Z',
    description: 'The estimated arrival time',
    nullable: true,
  })
  estimatedArrivalTime: Date;

  @Column({ name: 'actual_departure_time', type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2024-04-17T04:45:00.000Z',
    description: 'The actual departure time',
    nullable: true,
  })
  actualDepartureTime: Date;

  @Column({ name: 'actual_arrival_time', type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2024-04-17T05:49:00.000Z',
    description: 'The actual arrival time',
    nullable: true,
  })
  actualArrivalTime: Date;

  @Column({ name: 'departure_stand', nullable: true })
  @ApiProperty({
    example: 'C5',
    description: 'The departure stand of the flight',
    nullable: true,
  })
  departureStand: string;

  @Column({ name: 'original_departure_stand', nullable: true })
  @ApiProperty({
    example: 'A1',
    description: 'The original departure stand of the flight',
    nullable: true,
  })
  originalDepartureStand: string;

  @Column({ name: 'arrival_stand', nullable: true })
  @ApiProperty({
    example: 'B2',
    description: 'The arrival stand of the flight',
    nullable: true,
  })
  arrivalStand: string;

  @Column({ name: 'original_arrival_stand', nullable: true })
  @ApiProperty({
    example: 'B2',
    description: 'The original arrival stand of the flight',
    nullable: true,
  })
  originalArrivalStand: string;

  /**
   * The departure stand of the flight based on the actual departure stand,
   * estimated departure stand, or scheduled departure stand.
   * @returns
   */
  start(): Date {
    return (
      this.actualDepartureTime ||
      this.estimatedDepartureTime ||
      this.scheduledDepartureTime
    );
  }

  /**
   * The arrival stand of the flight based on the actual arrival stand,
   * estimated arrival stand, or scheduled arrival stand.
   *
   * @returns
   */
  end(): Date {
    return (
      this.actualArrivalTime ||
      this.estimatedArrivalTime ||
      this.scheduledArrivalTime
    );
  }
}
