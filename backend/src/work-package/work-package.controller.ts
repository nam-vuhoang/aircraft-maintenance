import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { WorkPackageService } from './work-package.service';
import { WorkPackage } from './work-package.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('work-packages')
@Controller('work-packages')
export class WorkPackageController {
  constructor(private readonly workPackageService: WorkPackageService) {}

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
  @ApiResponse({
    status: 200,
    description: 'The work package with the given ID',
    type: WorkPackage,
  })
  findOne(@Param('id') id: number): Promise<WorkPackage> {
    return this.workPackageService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new work package' })
  @ApiResponse({
    status: 201,
    description: 'The work package has been successfully created',
    type: WorkPackage,
  })
  create(@Body() workPackage: WorkPackage): Promise<WorkPackage> {
    return this.workPackageService.create(workPackage);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a work package by ID' })
  @ApiResponse({
    status: 200,
    description: 'The work package has been successfully updated',
    type: WorkPackage,
  })
  update(
    @Param('id') id: number,
    @Body() workPackage: WorkPackage,
  ): Promise<WorkPackage> {
    return this.workPackageService.update(id, workPackage);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a work package by ID' })
  @ApiResponse({
    status: 200,
    description: 'The work package has been successfully deleted',
  })
  remove(@Param('id') id: number): Promise<void> {
    return this.workPackageService.remove(id);
  }
}
