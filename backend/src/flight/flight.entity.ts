import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDurationEntity } from '../common/base-duration.entity';

@Entity('flights')
export class Flight extends BaseDurationEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the flight',
  })
  id: number;

  @Column()
  @ApiProperty({
    example: 'ABC123',
    description: 'The registration number of the flight',
  })
  registration: string;

  @Column({ name: 'scheduled_departure_station' })
  @ApiProperty({
    example: 'JFK',
    description: 'The scheduled departure station',
  })
  scheduledDepartureStation: string;

  @Column({ name: 'scheduled_arrival_station' })
  @ApiProperty({ example: 'LAX', description: 'The scheduled arrival station' })
  scheduledArrivalStation: string;

  @Column({ name: 'scheduled_departure_time', type: 'timestamp' })
  @ApiProperty({
    example: '2024-04-15T18:00:00Z',
    description: 'The scheduled departure time',
  })
  scheduledDepartureTime: Date;

  @Column({ name: 'scheduled_arrival_time', type: 'timestamp' })
  @ApiProperty({
    example: '2024-04-15T21:00:00Z',
    description: 'The scheduled arrival time',
  })
  scheduledArrivalTime: Date;

  @Column({
    name: 'estimated_departure_time',
    type: 'timestamp',
    nullable: true,
  })
  @ApiProperty({
    example: '2024-04-15T18:15:00Z',
    description: 'The estimated departure time',
    nullable: true,
  })
  estimatedDepartureTime: Date;

  @Column({ name: 'estimated_arrival_time', type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2024-04-15T21:15:00Z',
    description: 'The estimated arrival time',
    nullable: true,
  })
  estimatedArrivalTime: Date;

  @Column({ name: 'actual_departure_time', type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2024-04-15T18:20:00Z',
    description: 'The actual departure time',
    nullable: true,
  })
  actualDepartureTime: Date;

  @Column({ name: 'actual_arrival_time', type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2024-04-15T21:20:00Z',
    description: 'The actual arrival time',
    nullable: true,
  })
  actualArrivalTime: Date;

  start(): Date {
    return (
      this.actualDepartureTime ||
      this.estimatedDepartureTime ||
      this.scheduledDepartureTime
    );
  }

  end(): Date {
    return (
      this.actualArrivalTime ||
      this.estimatedArrivalTime ||
      this.scheduledArrivalTime
    );
  }
}
