import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { FlightFilter } from './flight-filter.dto';
import { NotFoundException } from '@nestjs/common';

const mockFlightRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('FlightService', () => {
  let service: FlightService;
  let repository: MockRepository<Flight>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightService,
        {
          provide: getRepositoryToken(Flight),
          useValue: mockFlightRepository(),
        },
      ],
    }).compile();

    service = module.get<FlightService>(FlightService);
    repository = module.get<MockRepository<Flight>>(getRepositoryToken(Flight));
  });

  describe('create', () => {
    it('should create a flight', async () => {
      const flight = new Flight();
      repository.save.mockResolvedValue(flight);

      const result = await service.create(flight);
      expect(result).toEqual(flight);
      expect(repository.save).toHaveBeenCalledWith(flight);
    });
  });

  describe('createAll', () => {
    it('should create multiple flights', async () => {
      const flights = [new Flight(), new Flight()];
      repository.save.mockResolvedValue(flights);

      const result = await service.createAll(flights);
      expect(result).toEqual(flights);
      expect(repository.save).toHaveBeenCalledWith(flights);
    });
  });

  describe('findAll', () => {
    it('should find all flights', async () => {
      const flights = [new Flight(), new Flight()];
      repository.find.mockResolvedValue(flights);

      const result = await service.findAll();
      expect(result).toEqual(flights);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a flight by ID', async () => {
      const flight = new Flight();
      repository.findOne.mockResolvedValue(flight);

      const result = await service.findOne('1');
      expect(result).toEqual(flight);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if flight not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('update', () => {
    it('should update a flight by ID', async () => {
      const flight = new Flight();
      repository.update.mockResolvedValue(null);
      repository.findOne.mockResolvedValue(flight);

      const result = await service.update('1', flight);
      expect(result).toEqual(flight);
      expect(repository.update).toHaveBeenCalledWith('1', flight);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if flight not found for update', async () => {
      const flight = new Flight();
      repository.update.mockResolvedValue(null);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('1', flight)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.update).toHaveBeenCalledWith('1', flight);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('remove', () => {
    it('should remove a flight by ID', async () => {
      repository.delete.mockResolvedValue(null);

      await service.remove('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('search', () => {
    it('should search flights with filter', async () => {
      const flights = [new Flight(), new Flight()];
      const filter: FlightFilter = {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        flightNumbers: ['123'],
        airlines: ['AA'],
        registrations: ['N12345'],
        aircraftTypes: ['B737'],
        departureStations: ['JFK'],
        arrivalStations: ['LAX'],
        stations: ['JFK', 'LAX'],
        limit: 10,
      };
      const queryBuilder: any = {
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(flights),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.search(filter);
      expect(result).toEqual(flights);
      // Expecting 8 calls: 2 for startTime and endTime, and 1 each for flightNumbers, airlines, registrations, aircraftTypes, departureStations, arrivalStations, and stations
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(9);
      expect(queryBuilder.limit).toHaveBeenCalledWith(10);
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('getCategoryValues', () => {
    it('should get distinct and sorted values for a category', async () => {
      const values = [{ value: 'AA' }, { value: 'BB' }];
      repository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(values),
      });

      const result = await service.getCategoryValues('airlines');
      expect(result).toEqual(['AA', 'BB']);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('flight');
    });

    it('should throw NotFoundException if category not found', async () => {
      await expect(service.getCategoryValues('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
