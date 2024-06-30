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
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('work-packages')
@Controller('work-packages')
export class WorkPackageController {
  constructor(private readonly workPackageService: WorkPackageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work package' })
  create(@Body() workPackage: WorkPackage): Promise<WorkPackage> {
    return this.workPackageService.create(workPackage);
  }

  @Get()
  @ApiOperation({ summary: 'Get all work packages' })
  findAll(): Promise<WorkPackage[]> {
    return this.workPackageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a work package by ID' })
  async findOne(@Param('id') id: string): Promise<WorkPackage> {
    const workPackage = await this.workPackageService.findOne(id);
    if (!workPackage) {
      throw new NotFoundException(`Work package with ID ${id} not found`);
    }
    return workPackage;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a work package by ID' })
  update(
    @Param('id') id: string,
    @Body() workPackage: WorkPackage,
  ): Promise<WorkPackage> {
    return this.workPackageService.update(id, workPackage);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a work package by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.workPackageService.remove(id);
  }
}
