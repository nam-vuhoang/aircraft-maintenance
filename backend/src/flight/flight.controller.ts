import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { FlightFilter } from './flight-filter.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('flights')
@Controller('flights')
export class FlightController {
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
    const flight = await this.flightService.findOne(id);
    if (!flight) {
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
    return this.flightService.search(filter);
  }
}
