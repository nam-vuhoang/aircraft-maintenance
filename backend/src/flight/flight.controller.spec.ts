import { Test, TestingModule } from '@nestjs/testing';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { FlightFilter } from './flight-filter.dto';
import { FlightImportDto } from './flight-import.dto';
import { NotFoundException } from '@nestjs/common';

const mockFlightService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  search: jest.fn(),
  createAll: jest.fn(),
  getCategoryValues: jest.fn(),
});

describe('FlightController', () => {
  let controller: FlightController;
  let service: ReturnType<typeof mockFlightService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightController],
      providers: [
        {
          provide: FlightService,
          useValue: mockFlightService(),
        },
      ],
    }).compile();

    controller = module.get<FlightController>(FlightController);
    service = module.get<ReturnType<typeof mockFlightService>>(FlightService);
  });

  describe('create', () => {
    it('should create a flight', async () => {
      const flight = new Flight();
      service.create.mockResolvedValue(flight);

      const result = await controller.create(flight);
      expect(result).toEqual(flight);
      expect(service.create).toHaveBeenCalledWith(flight);
    });
  });

  describe('findAll', () => {
    it('should find all flights', async () => {
      const flights = [new Flight(), new Flight()];
      service.findAll.mockResolvedValue(flights);

      const result = await controller.findAll();
      expect(result).toEqual(flights);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a flight by ID', async () => {
      const flight = new Flight();
      service.findOne.mockResolvedValue(flight);

      const result = await controller.findOne('1');
      expect(result).toEqual(flight);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if flight not found', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a flight by ID', async () => {
      const flight = new Flight();
      service.update.mockResolvedValue(flight);

      const result = await controller.update('1', flight);
      expect(result).toEqual(flight);
      expect(service.update).toHaveBeenCalledWith('1', flight);
    });

    it('should throw NotFoundException if flight not found for update', async () => {
      service.update.mockResolvedValue(null);

      await expect(controller.update('1', new Flight())).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith('1', expect.any(Flight));
    });
  });

  describe('remove', () => {
    it('should remove a flight by ID', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('search', () => {
    it('should search flights with filter', async () => {
      const flights = [new Flight(), new Flight()];
      const filter: FlightFilter = {
        startTime: '2024-04-16T08:00:00Z',
        endTime: '2024-04-16T09:30:00Z',
        flightNumbers: ['8929', '8930'],
        airlines: ['QO'],
        registrations: ['ABA'],
        aircraftTypes: ['AT7'],
        departureStations: ['HEL', 'JFK'],
        arrivalStations: ['RIX', 'LAX'],
        limit: 10,
      };
      service.search.mockResolvedValue(flights);

      const result = await controller.search(filter);
      expect(result).toEqual(flights);
      expect(service.search).toHaveBeenCalledWith(filter);
    });
  });

  describe('import', () => {
    it('should import flights from JSON', async () => {
      const importDtos: FlightImportDto[] = [
        Object.assign(new FlightImportDto(), {
          flightId: '007f78fb-2586-432a-a952-d19d63e18cc2',
          airline: 'QO',
          registration: 'ABA',
          aircraftType: 'AT7',
          flightNum: '8929',
          schedDepTime: '2024-04-17T04:45:00.000Z',
          schedArrTime: '2024-04-17T05:55:00.000Z',
          actualDepTime: '2024-04-17T04:45:00.000Z',
          actualArrTime: '2024-04-17T05:49:00.000Z',
          estimatedDepTime: '2024-04-17T04:45:00.000Z',
          estimatedArrTime: '2024-04-17T05:49:00.000Z',
          schedDepStation: 'HEL',
          schedArrStation: 'RIX',
          depStand: 'C5',
          origDepStand: 'A1',
          arrStand: 'B2',
          origArrStand: 'B2',
        }),
      ];
      const flights = importDtos.map((dto) => dto.convertToFlightEntity());
      service.createAll.mockResolvedValue(flights);

      const result = await controller.import(importDtos);
      expect(result).toEqual({ imported: importDtos.length });
      expect(service.createAll).toHaveBeenCalledWith(flights);
    });
  });

  describe('getCategoryValues', () => {
    it('should get unique and sorted values for a category', async () => {
      const values = ['QO', 'AA'];
      service.getCategoryValues.mockResolvedValue(values);

      const result = await controller.getCategoryValues('airlines');
      expect(result).toEqual(values);
      expect(service.getCategoryValues).toHaveBeenCalledWith('airlines');
    });

    it('should throw NotFoundException if category not found', async () => {
      service.getCategoryValues.mockRejectedValue(
        new NotFoundException('Category not found'),
      );

      await expect(controller.getCategoryValues('unknown')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getCategoryValues).toHaveBeenCalledWith('unknown');
    });
  });
});
