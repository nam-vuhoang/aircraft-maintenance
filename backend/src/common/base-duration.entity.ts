import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * The base entity for entities with a duration.
 */
export abstract class BaseDurationEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
    description: 'The unique identifier (UUID)',
  })
  id: string;

  @Column()
  @ApiProperty({
    example: 'ABC123',
    description: 'The registration number',
  })
  registration: string;

  abstract start(): Date;
  abstract end(): Date;
}
