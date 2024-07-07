import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './flight.entity';
import { FlightFilter } from './flight-filter.dto';

@Injectable()
export class FlightService {
  private readonly logger = new Logger(FlightService.name);

  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  async create(flight: Flight): Promise<Flight> {
    this.logger.log(`Creating a new flight: ${JSON.stringify(flight)}`);
    const createdFlight = await this.flightRepository.save(flight);
    this.logger.log(`Flight created with ID: ${createdFlight.id}`);
    return createdFlight;
  }

  async createAll(flights: Flight[]): Promise<Flight[]> {
    this.logger.log(`Creating multiple flights: ${JSON.stringify(flights)}`);
    const createdFlights = await this.flightRepository.save(flights);
    this.logger.log(`Created ${createdFlights.length} flights`);
    return createdFlights;
  }

  async findAll(): Promise<Flight[]> {
    this.logger.log('Fetching all flights');
    return this.flightRepository.find();
  }

  async findOne(id: string): Promise<Flight> {
    this.logger.log(`Fetching flight with ID: ${id}`);
    const flight = await this.flightRepository.findOne({ where: { id } });
    if (!flight) {
      this.logger.warn(`Flight with ID ${id} not found`);
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
    return flight;
  }

  async update(id: string, flight: Flight): Promise<Flight> {
    this.logger.log(`Updating flight with ID: ${id}`);
    await this.flightRepository.update(id, flight);
    const updatedFlight = await this.findOne(id);
    this.logger.log(`Flight with ID: ${id} updated`);
    return updatedFlight;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting flight with ID: ${id}`);
    await this.flightRepository.delete(id);
    this.logger.log(`Flight with ID: ${id} deleted`);
  }

  async search(filter: FlightFilter): Promise<Flight[]> {
    this.logger.log(`Searching flights with filter: ${JSON.stringify(filter)}`);
    const query = this.flightRepository.createQueryBuilder('flight');

    if (filter.startTime) {
      query.andWhere(
        'COALESCE(flight.actualDepartureTime, flight.estimatedDepartureTime, flight.scheduledDepartureTime) >= :startTime',
        { startTime: filter.startTime },
      );
    }

    if (filter.endTime) {
      query.andWhere(
        'COALESCE(flight.actualArrivalTime, flight.estimatedArrivalTime, flight.scheduledArrivalTime) <= :endTime',
        { endTime: filter.endTime },
      );
    }

    if (filter.flightNumbers && filter.flightNumbers.length > 0) {
      query.andWhere('flight.flightNumber IN (:...flightNumbers)', {
        flightNumbers: filter.flightNumbers,
      });
    }

    if (filter.airlines && filter.airlines.length > 0) {
      query.andWhere('flight.airline IN (:...airlines)', {
        airlines: filter.airlines,
      });
    }

    if (filter.registrations && filter.registrations.length > 0) {
      query.andWhere('flight.registration IN (:...registrations)', {
        registrations: filter.registrations,
      });
    }

    if (filter.aircraftTypes && filter.aircraftTypes.length > 0) {
      query.andWhere('flight.aircraftType IN (:...aircraftTypes)', {
        aircraftTypes: filter.aircraftTypes,
      });
    }

    if (filter.departureStations && filter.departureStations.length > 0) {
      query.andWhere(
        'flight.scheduledDepartureStation IN (:...departureStations)',
        { departureStations: filter.departureStations },
      );
    }

    if (filter.arrivalStations && filter.arrivalStations.length > 0) {
      query.andWhere(
        'flight.scheduledArrivalStation IN (:...arrivalStations)',
        { arrivalStations: filter.arrivalStations },
      );
    }

    if (filter.limit) {
      query.limit(filter.limit);
    }

    const results = await query.getMany();
    this.logger.log(`Found ${results.length} flights`);
    return results;
  }

  async getCategoryValues(category: string): Promise<string[]> {
    this.logger.log(`Getting category values for category: ${category}`);
    let results;

    switch (category) {
      case 'registrations':
        results = await this.flightRepository
          .createQueryBuilder('flight')
          .select('DISTINCT flight.registration', 'value')
          .orderBy('value')
          .getRawMany();
        break;
      case 'airlines':
        results = await this.flightRepository
          .createQueryBuilder('flight')
          .select('DISTINCT flight.airline', 'value')
          .orderBy('value')
          .getRawMany();
        break;
      case 'aircraftTypes':
        results = await this.flightRepository
          .createQueryBuilder('flight')
          .select('DISTINCT flight.aircraftType', 'value')
          .orderBy('value')
          .getRawMany();
        break;
      case 'flightNumbers':
        results = await this.flightRepository
          .createQueryBuilder('flight')
          .select('DISTINCT flight.flightNumber', 'value')
          .orderBy('value')
          .getRawMany();
        break;
      case 'stations':
        const departureStations = await this.flightRepository
          .createQueryBuilder('flight')
          .select('DISTINCT flight.scheduledDepartureStation', 'value')
          .getRawMany();
        const arrivalStations = await this.flightRepository
          .createQueryBuilder('flight')
          .select('DISTINCT flight.scheduledArrivalStation', 'value')
          .getRawMany();

        const stations = new Set([
          ...departureStations.map((result) => result.value),
          ...arrivalStations.map((result) => result.value),
        ]);

        results = Array.from(stations).sort();
        return results;
      default:
        this.logger.warn(`Category ${category} not found`);
        throw new NotFoundException(`Category ${category} not found`);
    }

    this.logger.log(`Found ${results.length} values for category ${category}`);
    return results.map((result) => result.value);
  }
}
