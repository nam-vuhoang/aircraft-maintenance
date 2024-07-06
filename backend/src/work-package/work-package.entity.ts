import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AircraftTask } from '../aircraft/aircraft-task.entity';

/**
 * The work package entity
 */
@Entity('work_packages')
@Index(['registration', 'station', 'status', 'area'])
export class WorkPackage extends AircraftTask {
  @PrimaryColumn()
  @ApiProperty({
    example: 'WP12345',
    description: 'The unique identifier of the work package',
  })
  id: string;

  @Column()
  @ApiProperty({
    example: 'Maintenance A',
    description: 'The name of the work package',
  })
  name: string;

  @Column()
  @ApiProperty({
    example: 'HEL',
    description: 'The station where the work package is executed',
  })
  station: string;

  @Column()
  @ApiProperty({
    example: 'OPEN',
    description: 'The status of the work package',
  })
  status: string;

  @Column()
  @ApiProperty({
    example: 'APRON',
    description: 'The area of the work package',
  })
  area: string;

  @Column({ name: 'start_time', type: 'timestamp with time zone' })
  @ApiProperty({
    example: '2024-04-16T08:00:00Z',
    description: 'The start time of the work package',
  })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp with time zone' })
  @ApiProperty({
    example: '2024-04-16T09:30:00Z',
    description: 'The end time of the work package',
  })
  endTime: Date;
}
