import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './flight.entity';

/**
 * Service for managing flights.
 */
@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  create(flight: Flight): Promise<Flight> {
    return this.flightRepository.save(flight);
  }

  findAll(): Promise<Flight[]> {
    return this.flightRepository.find();
  }

  async findOne(id: string): Promise<Flight> {
    const flight = await this.flightRepository.findOne({ where: { id } });
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
    return flight;
  }

  async update(id: string, flight: Flight): Promise<Flight> {
    await this.flightRepository.update(id, flight);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.flightRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
  }

  async findOverlapping(startTime?: Date, endTime?: Date): Promise<Flight[]> {
    const query = this.flightRepository
      .createQueryBuilder('f')
      .where(
        `COALESCE(f.actual_departure_time, f.estimated_departure_time, f.scheduled_departure_time) < :endTime
        AND COALESCE(f.actual_arrival_time, f.estimated_arrival_time, f.scheduled_arrival_time) > :startTime`,
        {
          startTime: startTime || new Date(0),
          endTime: endTime || new Date('9999-12-31'),
        },
      )
      .select('f.*')
      .getRawMany();

    return query;
  }
}
