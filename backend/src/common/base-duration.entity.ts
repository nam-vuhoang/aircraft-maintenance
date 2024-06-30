import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class BaseDurationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  registration: string;

  abstract start(): Date;
  abstract end(): Date;
}
