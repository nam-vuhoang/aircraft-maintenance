import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkPackage } from './work-package.entity';
import { WorkPackageFilter } from './work-package-filter.dto';

@Injectable()
export class WorkPackageService {
  private readonly logger = new Logger(WorkPackageService.name);

  constructor(
    @InjectRepository(WorkPackage)
    private readonly workPackageRepository: Repository<WorkPackage>,
  ) {}

  async create(workPackage: WorkPackage): Promise<WorkPackage> {
    this.logger.log(
      `Creating a new work package: ${JSON.stringify(workPackage)}`,
    );
    const createdWorkPackage =
      await this.workPackageRepository.save(workPackage);
    this.logger.log(`Work package created with ID: ${createdWorkPackage.id}`);
    return createdWorkPackage;
  }

  async findAll(): Promise<WorkPackage[]> {
    this.logger.log('Fetching all work packages');
    return this.workPackageRepository.find();
  }

  async findOne(id: string): Promise<WorkPackage> {
    this.logger.log(`Fetching work package with ID: ${id}`);
    const workPackage = await this.workPackageRepository.findOne({
      where: { id },
    });
    if (!workPackage) {
      this.logger.warn(`Work package with ID ${id} not found`);
      throw new NotFoundException(`Work package with ID ${id} not found`);
    }
    return workPackage;
  }

  async update(id: string, workPackage: WorkPackage): Promise<WorkPackage> {
    this.logger.log(`Updating work package with ID: ${id}`);
    await this.workPackageRepository.update(id, workPackage);
    const updatedWorkPackage = await this.findOne(id);
    this.logger.log(`Work package with ID: ${id} updated`);
    return updatedWorkPackage;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting work package with ID: ${id}`);
    await this.workPackageRepository.delete(id);
    this.logger.log(`Work package with ID: ${id} deleted`);
  }

  async search(filter: WorkPackageFilter): Promise<WorkPackage[]> {
    this.logger.log(
      `Searching work packages with filter: ${JSON.stringify(filter)}`,
    );
    const query = this.workPackageRepository.createQueryBuilder('workPackage');

    if (filter.startTime) {
      query.andWhere('workPackage.startTime >= :startTime', {
        startTime: filter.startTime,
      });
    }

    if (filter.endTime) {
      query.andWhere('workPackage.endTime <= :endTime', {
        endTime: filter.endTime,
      });
    }

    if (filter.registrations && filter.registrations.length > 0) {
      query.andWhere('workPackage.registration IN (:...registrations)', {
        registrations: filter.registrations,
      });
    }

    if (filter.stations && filter.stations.length > 0) {
      query.andWhere('workPackage.station IN (:...stations)', {
        stations: filter.stations,
      });
    }

    if (filter.statuses && filter.statuses.length > 0) {
      query.andWhere('workPackage.status IN (:...statuses)', {
        statuses: filter.statuses,
      });
    }

    if (filter.areas && filter.areas.length > 0) {
      query.andWhere('workPackage.area IN (:...areas)', {
        areas: filter.areas,
      });
    }

    if (filter.namePattern) {
      query.andWhere('workPackage.name LIKE :namePattern', {
        namePattern: filter.namePattern,
      });
    }

    if (filter.limit) {
      query.limit(filter.limit);
    }

    const results = await query.getMany();
    this.logger.log(`Found ${results.length} work packages`);
    return results;
  }

  async getCategoryValues(category: string): Promise<string[]> {
    this.logger.log(`Getting category values for category: ${category}`);
    let results;

    switch (category) {
      case 'registrations':
        results = await this.workPackageRepository
          .createQueryBuilder('workPackage')
          .select('DISTINCT workPackage.registration', 'value')
          .orderBy('value')
          .getRawMany();
        break;
      case 'stations':
        results = await this.workPackageRepository
          .createQueryBuilder('workPackage')
          .select('DISTINCT workPackage.station', 'value')
          .orderBy('value')
          .getRawMany();
        break;
      case 'statuses':
        results = await this.workPackageRepository
          .createQueryBuilder('workPackage')
          .select('DISTINCT workPackage.status', 'value')
          .orderBy('value')
          .getRawMany();
        break;
      case 'areas':
        results = await this.workPackageRepository
          .createQueryBuilder('workPackage')
          .select('DISTINCT workPackage.area', 'value')
          .orderBy('value')
          .getRawMany();
        break;
      default:
        this.logger.warn(`Category ${category} not found`);
        throw new NotFoundException(`Category ${category} not found`);
    }

    this.logger.log(`Found ${results.length} values for category ${category}`);
    return results.map((result) => result.value);
  }
}
