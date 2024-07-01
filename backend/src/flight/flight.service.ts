import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './flight.entity';
import { FlightFilter } from './flight-filter.dto';

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

  async search(filter: FlightFilter): Promise<Flight[]> {
    const {
      startTime,
      endTime,
      flightNumbers,
      airlines,
      registrations,
      aircraftTypes,
      departureStations,
      arrivalStations,
      limit,
    } = filter;
    const query = this.flightRepository.createQueryBuilder('f');

    // Always-true condition to allow optional filtering
    query.where('1 = 1');

    if (startTime) {
      query.andWhere(
        `COALESCE(f.actual_departure_time, f.estimated_departure_time, f.scheduled_departure_time) > :startTime`,
        { startTime: new Date(startTime) },
      );
    }

    if (endTime) {
      query.andWhere(
        `COALESCE(f.actual_arrival_time, f.estimated_arrival_time, f.scheduled_arrival_time) < :endTime`,
        { endTime: new Date(endTime) },
      );
    }

    if (flightNumbers && flightNumbers.length > 0) {
      query.andWhere('f.flight_number IN (:...flightNumbers)', {
        flightNumbers,
      });
    }

    if (airlines && airlines.length > 0) {
      query.andWhere('f.airline IN (:...airlines)', { airlines });
    }

    if (registrations && registrations.length > 0) {
      query.andWhere('f.registration IN (:...registrations)', {
        registrations,
      });
    }

    if (aircraftTypes && aircraftTypes.length > 0) {
      query.andWhere('f.aircraft_type IN (:...aircraftTypes)', {
        aircraftTypes,
      });
    }

    if (departureStations && departureStations.length > 0) {
      query.andWhere(
        'f.scheduled_departure_station IN (:...departureStations)',
        { departureStations },
      );
    }

    if (arrivalStations && arrivalStations.length > 0) {
      query.andWhere('f.scheduled_arrival_station IN (:...arrivalStations)', {
        arrivalStations,
      });
    }

    if (limit) {
      query.limit(limit);
    }

    return query.getMany();
  }
}
