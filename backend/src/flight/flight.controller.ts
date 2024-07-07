import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  Delete,
  NotFoundException,
  Logger,
  ParseArrayPipe,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { FlightFilter } from './flight-filter.dto';
import { FlightImportDto } from './flight-import.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('flights')
@Controller('flights')
export class FlightController {
  private readonly logger = new Logger(FlightController.name);

  constructor(private readonly flightService: FlightService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new flight' })
  @ApiBody({
    description: 'The flight data',
    type: Flight,
    examples: {
      example1: {
        summary: 'Example flight',
        value: {
          id: '007f78fb-2586-432a-a952-d19d63e18cc2',
          airline: 'QO',
          registration: 'ABA',
          aircraftType: 'AT7',
          flightNumber: '8929',
          scheduledDepartureStation: 'HEL',
          scheduledArrivalStation: 'RIX',
          scheduledDepartureTime: '2024-04-17T04:45:00.000Z',
          scheduledArrivalTime: '2024-04-17T05:55:00.000Z',
          actualDepartureTime: '2024-04-17T04:45:00.000Z',
          actualArrivalTime: '2024-04-17T05:49:00.000Z',
          estimatedDepartureTime: '2024-04-17T04:45:00.000Z',
          estimatedArrivalTime: '2024-04-17T05:49:00.000Z',
          departureStand: 'C5',
          originalDepartureStand: 'A1',
          arrivalStand: 'B2',
          originalArrivalStand: 'B2',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The created flight',
    type: Flight,
  })
  create(@Body() flight: Flight): Promise<Flight> {
    this.logger.log(`Creating a new flight: ${JSON.stringify(flight)}`);
    return this.flightService.create(flight);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flights' })
  @ApiResponse({
    status: 200,
    description: 'List of all flights',
    type: [Flight],
  })
  findAll(): Promise<Flight[]> {
    this.logger.log('Fetching all flights');
    return this.flightService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a flight by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the flight',
    type: String,
    example: '007f78fb-2586-432a-a952-d19d63e18cc2',
  })
  @ApiResponse({
    status: 200,
    description: 'The flight with the given ID',
    type: Flight,
  })
  @ApiResponse({
    status: 404,
    description: 'Flight not found',
  })
  async findOne(@Param('id') id: string): Promise<Flight> {
    this.logger.log(`Fetching flight with ID: ${id}`);
    const flight = await this.flightService.findOne(id);
    if (!flight) {
      this.logger.warn(`Flight with ID ${id} not found`);
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
    return flight;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a flight by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the flight to update',
    type: String,
    example: '007f78fb-2586-432a-a952-d19d63e18cc2',
  })
  @ApiBody({
    description: 'The updated flight data',
    type: Flight,
    examples: {
      example1: {
        summary: 'Example updated flight',
        value: {
          airline: 'QO',
          registration: 'ABA',
          aircraftType: 'AT7',
          flightNumber: '8929',
          scheduledDepartureStation: 'HEL',
          scheduledArrivalStation: 'RIX',
          scheduledDepartureTime: '2024-04-17T04:45:00.000Z',
          scheduledArrivalTime: '2024-04-17T05:55:00.000Z',
          actualDepartureTime: '2024-04-17T04:45:00.000Z',
          actualArrivalTime: '2024-04-17T05:49:00.000Z',
          estimatedDepartureTime: '2024-04-17T04:45:00.000Z',
          estimatedArrivalTime: '2024-04-17T05:49:00.000Z',
          departureStand: 'C5',
          originalDepartureStand: 'A1',
          arrivalStand: 'B2',
          originalArrivalStand: 'B2',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The updated flight',
    type: Flight,
  })
  @ApiResponse({
    status: 404,
    description: 'Flight not found',
  })
  update(@Param('id') id: string, @Body() flight: Flight): Promise<Flight> {
    this.logger.log(`Updating flight with ID: ${id}`);
    return this.flightService.update(id, flight);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a flight by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the flight to delete',
    type: String,
    example: '007f78fb-2586-432a-a952-d19d63e18cc2',
  })
  @ApiResponse({
    status: 200,
    description: 'Flight successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Flight not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting flight with ID: ${id}`);
    return this.flightService.remove(id);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search flights with optional filters' })
  @ApiBody({
    type: FlightFilter,
    description: 'Optional filters for searching flights',
    examples: {
      example1: {
        summary: 'Example search',
        value: {
          startTime: '2024-04-16T08:00:00Z',
          endTime: '2024-04-16T09:30:00Z',
          flightNumbers: ['8929', '8930'],
          airlines: ['QO'],
          registrations: ['ABA'],
          aircraftTypes: ['AT7'],
          departureStations: ['HEL', 'JFK'],
          arrivalStations: ['RIX', 'LAX'],
          limit: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'List of flights matching the search criteria',
    type: [Flight],
  })
  search(@Body() filter: FlightFilter): Promise<Flight[]> {
    this.logger.log(`Searching flights with filter: ${JSON.stringify(filter)}`);
    return this.flightService.search(filter);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import flights from JSON' })
  @ApiBody({
    description: 'The flights import data',
    type: [FlightImportDto],
    examples: {
      example1: {
        summary: 'Example import data',
        value: [
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
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Number of imported flights',
  })
  async import(
    @Body(new ParseArrayPipe({ items: FlightImportDto }))
    importFlightsDto: FlightImportDto[],
  ): Promise<{ imported: number }> {
    this.logger.log(`Importing ${importFlightsDto.length} flights`);
    await this.flightService.createAll(
      importFlightsDto.map((f) => f.convertToFlightEntity()),
    );
    this.logger.log(`Imported ${importFlightsDto.length} flights`);
    return { imported: importFlightsDto.length };
  }

  @Get('categories/:category')
  @ApiOperation({ summary: 'Get unique and sorted values for a category' })
  @ApiParam({
    name: 'category',
    description: 'The category to retrieve unique values for',
    enum: [
      'airlines',
      'aircraftTypes',
      'flightNumbers',
      'registrations',
      'stations',
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Unique and sorted values for the specified category',
    type: [String],
  })
  getCategoryValues(@Param('category') category: string): Promise<string[]> {
    this.logger.log(`Getting category values for category: ${category}`);
    return this.flightService.getCategoryValues(category);
  }
}
