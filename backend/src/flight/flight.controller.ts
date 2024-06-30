import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('flights')
@Controller('flights')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

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
  @ApiResponse({
    status: 200,
    description: 'The flight with the given ID',
    type: Flight,
  })
  findOne(@Param('id') id: number): Promise<Flight> {
    return this.flightService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new flight' })
  @ApiResponse({
    status: 201,
    description: 'The flight has been successfully created',
    type: Flight,
  })
  create(@Body() flight: Flight): Promise<Flight> {
    return this.flightService.create(flight);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a flight by ID' })
  @ApiResponse({
    status: 200,
    description: 'The flight has been successfully updated',
    type: Flight,
  })
  update(@Param('id') id: number, @Body() flight: Flight): Promise<Flight> {
    return this.flightService.update(id, flight);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a flight by ID' })
  @ApiResponse({
    status: 200,
    description: 'The flight has been successfully deleted',
  })
  remove(@Param('id') id: number): Promise<void> {
    return this.flightService.remove(id);
  }
}
