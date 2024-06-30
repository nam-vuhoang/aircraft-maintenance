import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';

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

  // Add tests for each CRUD operation here...
});
