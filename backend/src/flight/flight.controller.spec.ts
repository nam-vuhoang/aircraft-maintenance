import { Test, TestingModule } from '@nestjs/testing';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { NotFoundException } from '@nestjs/common';
import { FlightFilter } from './flight-filter.dto';
import { FlightImportDto } from './flight-import.dto';

describe('FlightController', () => {
  let controller: FlightController;
  let service: FlightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightController],
      providers: [
        {
          provide: FlightService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            search: jest.fn(),
            getCategoryValues: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FlightController>(FlightController);
    service = module.get<FlightService>(FlightService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a flight', async () => {
    const flight = new Flight();
    jest.spyOn(service, 'create').mockResolvedValue(flight);
    expect(await controller.create(flight)).toBe(flight);
    expect(service.create).toHaveBeenCalledWith(flight);
  });

  it('should return all flights', async () => {
    const flights = [new Flight(), new Flight()];
    jest.spyOn(service, 'findAll').mockResolvedValue(flights);
    expect(await controller.findAll()).toBe(flights);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a flight by ID', async () => {
    const id = '1';
    const flight = new Flight();
    jest.spyOn(service, 'findOne').mockResolvedValue(flight);
    expect(await controller.findOne(id)).toBe(flight);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should throw an error if flight not found', async () => {
    const id = '1';
    jest.spyOn(service, 'findOne').mockResolvedValue(null);
    await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('should update a flight', async () => {
    const id = '1';
    const flight = new Flight();
    jest.spyOn(service, 'update').mockResolvedValue(flight);
    expect(await controller.update(id, flight)).toBe(flight);
    expect(service.update).toHaveBeenCalledWith(id, flight);
  });

  it('should delete a flight', async () => {
    const id = '1';
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);
    await expect(controller.remove(id)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(id);
  });

  it('should search flights with filter', async () => {
    const filter: FlightFilter = { flightNumbers: ['123'] };
    const flights = [new Flight()];
    jest.spyOn(service, 'search').mockResolvedValue(flights);
    expect(await controller.search(filter)).toBe(flights);
    expect(service.search).toHaveBeenCalledWith(filter);
  });

  it('should import flights', async () => {
    const importFlightsDto: FlightImportDto[] = [
      {
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
        convertToFlightEntity: function (): Flight {
          const flight = new Flight();
          flight.id = this.flightId;
          flight.airline = this.airline;
          flight.registration = this.registration;
          flight.aircraftType = this.aircraftType;
          flight.flightNumber = this.flightNum;
          flight.scheduledDepartureTime = new Date(this.schedDepTime);
          flight.scheduledArrivalTime = new Date(this.schedArrTime);
          flight.actualDepartureTime =
            this.actualDepTime && new Date(this.actualDepTime);
          flight.actualArrivalTime =
            this.actualArrTime && new Date(this.actualArrTime);
          flight.estimatedDepartureTime =
            this.estimatedDepTime && new Date(this.estimatedDepTime);
          flight.estimatedArrivalTime =
            this.estimatedArrTime && new Date(this.estimatedArrTime);
          flight.scheduledDepartureStation = this.schedDepStation;
          flight.scheduledArrivalStation = this.schedArrStation;
          flight.departureStand = this.depStand;
          flight.originalDepartureStand = this.origDepStand;
          flight.arrivalStand = this.arrStand;
          flight.originalArrivalStand = this.origArrStand;
          return flight;
        },
      },
    ];

    jest.spyOn(service, 'create').mockResolvedValue(new Flight());
    const result = await controller.import(importFlightsDto);

    expect(result).toEqual({ imported: importFlightsDto.length });
    expect(service.create).toHaveBeenCalledTimes(importFlightsDto.length);
    importFlightsDto.forEach((dto) => {
      expect(service.create).toHaveBeenCalledWith(dto.convertToFlightEntity());
    });
  });

  it('should get category values', async () => {
    const category = 'airlines';
    const values = ['A', 'B'];
    jest.spyOn(service, 'getCategoryValues').mockResolvedValue(values);
    expect(await controller.getCategoryValues(category)).toBe(values);
    expect(service.getCategoryValues).toHaveBeenCalledWith(category);
  });

  it('should throw an error for unknown category', async () => {
    const category = 'unknown';
    jest
      .spyOn(service, 'getCategoryValues')
      .mockRejectedValue(new NotFoundException());
    await expect(controller.getCategoryValues(category)).rejects.toThrow(
      NotFoundException,
    );
  });
});
