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
import { WorkPackageService } from './work-package.service';
import { WorkPackage } from './work-package.entity';
import { WorkPackageFilter } from './work-package-filter.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('work-packages')
@Controller('work-packages')
export class WorkPackageController {
  constructor(private readonly workPackageService: WorkPackageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work package' })
  @ApiBody({
    description: 'The work package data',
    type: WorkPackage,
    examples: {
      example1: {
        summary: 'Example work package',
        value: {
          id: 'WP12345',
          registration: 'ABC123',
          name: 'Maintenance A',
          station: 'HEL',
          status: 'OPEN',
          area: 'APRON',
          startTime: '2024-04-16T08:00:00.000Z',
          endTime: '2024-04-16T09:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The created work package',
    type: WorkPackage,
  })
  create(@Body() workPackage: WorkPackage): Promise<WorkPackage> {
    return this.workPackageService.create(workPackage);
  }

  @Get()
  @ApiOperation({ summary: 'Get all work packages' })
  @ApiResponse({
    status: 200,
    description: 'List of all work packages',
    type: [WorkPackage],
  })
  findAll(): Promise<WorkPackage[]> {
    return this.workPackageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a work package by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the work package',
    type: String,
    example: 'WP12345',
  })
  @ApiResponse({
    status: 200,
    description: 'The work package with the given ID',
    type: WorkPackage,
  })
  @ApiResponse({
    status: 404,
    description: 'Work package not found',
  })
  async findOne(@Param('id') id: string): Promise<WorkPackage> {
    const workPackage = await this.workPackageService.findOne(id);
    if (!workPackage) {
      throw new NotFoundException(`WorkPackage with ID ${id} not found`);
    }
    return workPackage;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a work package by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the work package to update',
    type: String,
    example: 'WP12345',
  })
  @ApiBody({
    description: 'The updated work package data',
    type: WorkPackage,
    examples: {
      example1: {
        summary: 'Example updated work package',
        value: {
          registration: 'ABC123',
          name: 'Maintenance A',
          station: 'HEL',
          status: 'OPEN',
          area: 'APRON',
          startTime: '2024-04-16T08:00:00.000Z',
          endTime: '2024-04-16T09:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The updated work package',
    type: WorkPackage,
  })
  @ApiResponse({
    status: 404,
    description: 'Work package not found',
  })
  update(
    @Param('id') id: string,
    @Body() workPackage: WorkPackage,
  ): Promise<WorkPackage> {
    return this.workPackageService.update(id, workPackage);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a work package by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the work package to delete',
    type: String,
    example: 'WP12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Work package successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Work package not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.workPackageService.remove(id);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search work packages with optional filters' })
  @ApiBody({
    type: WorkPackageFilter,
    description: 'Optional filters for searching work packages',
    examples: {
      example1: {
        summary: 'Example search',
        value: {
          startTime: '2024-04-16T08:00:00Z',
          endTime: '2024-04-16T09:30:00Z',
          registrations: ['ABB', 'ABD'],
          namePattern: 'ABB%',
          stations: ['HEL', 'JFK'],
          statuses: ['OPEN', 'CLOSED'],
          areas: ['APRON', 'HANGAR'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'List of work packages matching the search criteria',
    type: [WorkPackage],
  })
  search(@Body() filter: WorkPackageFilter): Promise<WorkPackage[]> {
    return this.workPackageService.search(filter);
  }
}
