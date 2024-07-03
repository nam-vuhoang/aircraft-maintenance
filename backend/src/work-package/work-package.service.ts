import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkPackage } from './work-package.entity';
import { WorkPackageFilter } from './work-package-filter.dto';

@Injectable()
export class WorkPackageService {
  constructor(
    @InjectRepository(WorkPackage)
    private readonly workPackageRepository: Repository<WorkPackage>,
  ) {}

  create(workPackage: WorkPackage): Promise<WorkPackage> {
    return this.workPackageRepository.save(workPackage);
  }

  findAll(): Promise<WorkPackage[]> {
    return this.workPackageRepository.find();
  }

  async findOne(id: string): Promise<WorkPackage> {
    const workPackage = await this.workPackageRepository.findOne({
      where: { id },
    });
    if (!workPackage) {
      throw new NotFoundException(`WorkPackage with ID ${id} not found`);
    }
    return workPackage;
  }

  async update(id: string, workPackage: WorkPackage): Promise<WorkPackage> {
    await this.workPackageRepository.update(id, workPackage);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.workPackageRepository.delete(id);
  }

  async search(filter: WorkPackageFilter): Promise<WorkPackage[]> {
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

    return query.getMany();
  }

  async getCategoryValues(category: string): Promise<string[]> {
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
        throw new NotFoundException(`Category ${category} not found`);
    }

    return results.map((result) => result.value);
  }
}
