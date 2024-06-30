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
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * REST API controller for managing flights.
 */
@ApiTags('flights')
@Controller('flights')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new flight' })
  create(@Body() flight: Flight): Promise<Flight> {
    return this.flightService.create(flight);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flights' })
  findAll(): Promise<Flight[]> {
    return this.flightService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a flight by ID' })
  async findOne(@Param('id') id: string): Promise<Flight> {
    const flight = await this.flightService.findOne(id);
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }
    return flight;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a flight by ID' })
  update(@Param('id') id: string, @Body() flight: Flight): Promise<Flight> {
    return this.flightService.update(id, flight);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a flight by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.flightService.remove(id);
  }
}
