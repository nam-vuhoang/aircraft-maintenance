import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDurationEntity as BaseDurationEntity } from '../common/base-duration.entity';

@Entity('work_packages')
export class WorkPackage extends BaseDurationEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the work package',
  })
  id: number;

  @Column()
  @ApiProperty({
    example: 'ABC123',
    description: 'The registration number of the work package',
  })
  registration: string;

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
