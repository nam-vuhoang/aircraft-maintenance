import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { NotFoundException } from '@nestjs/common';
import { FlightFilter } from './flight-filter.dto';

describe('FlightService', () => {
  let service: FlightService;
  let repository: Repository<Flight>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightService,
        {
          provide: getRepositoryToken(Flight),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FlightService>(FlightService);
    repository = module.get<Repository<Flight>>(getRepositoryToken(Flight));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a flight', async () => {
    const flight = new Flight();
    jest.spyOn(repository, 'save').mockResolvedValue(flight);
    expect(await service.create(flight)).toEqual(flight);
  });

  it('should return all flights', async () => {
    const flights = [new Flight(), new Flight()];
    jest.spyOn(repository, 'find').mockResolvedValue(flights);
    expect(await service.findAll()).toEqual(flights);
  });

  it('should return a flight by ID', async () => {
    const id = '1';
    const flight = new Flight();
    jest.spyOn(repository, 'findOne').mockResolvedValue(flight);
    expect(await service.findOne(id)).toEqual(flight);
  });

  it('should throw an error if flight not found', async () => {
    const id = '1';
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('should update a flight', async () => {
    const id = '1';
    const flight = new Flight();
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    jest.spyOn(service, 'findOne').mockResolvedValue(flight);
    expect(await service.update(id, flight)).toEqual(flight);
  });

  it('should delete a flight', async () => {
    const id = '1';
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    await expect(service.remove(id)).resolves.toBeUndefined();
  });

  it('should search flights with filter', async () => {
    const filter: FlightFilter = { flightNumbers: ['123'] };
    const flights = [new Flight()];
    const queryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(flights),
    };
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);
    expect(await service.search(filter)).toEqual(flights);
  });

  it('should get category values for registrations', async () => {
    const results = [{ value: 'A' }, { value: 'B' }];
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(results),
    } as any);
    expect(await service.getCategoryValues('registrations')).toEqual([
      'A',
      'B',
    ]);
  });

  it('should throw an error for unknown category', async () => {
    await expect(service.getCategoryValues('unknown')).rejects.toThrow(
      NotFoundException,
    );
  });
});
