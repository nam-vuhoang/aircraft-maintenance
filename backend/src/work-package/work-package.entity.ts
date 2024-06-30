import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDurationEntity } from '../common/base-duration.entity';

/**
 * The work package entity
 */
@Entity('work_packages')
export class WorkPackage extends BaseDurationEntity {
  @Column()
  @ApiProperty({
    example: 'ABC123',
    description: 'The registration number of the work package',
  })
  registration: string;

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

  @Column({ name: 'start_time', type: 'timestamp' })
  @ApiProperty({
    example: '2024-04-16T08:00:00Z',
    description: 'The start time of the work package',
  })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  @ApiProperty({
    example: '2024-04-16T09:30:00Z',
    description: 'The end time of the work package',
  })
  endTime: Date;

  start(): Date {
    return this.startTime;
  }

  end(): Date {
    return this.endTime;
  }
}
