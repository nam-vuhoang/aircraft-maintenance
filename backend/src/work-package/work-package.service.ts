import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkPackage } from './work-package.entity';
import { WorkPackageFilter } from './work-package-filter.dto';

/**
 * Service for managing work packages.
 */
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
    const result = await this.workPackageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`WorkPackage with ID ${id} not found`);
    }
  }

  async search(filter: WorkPackageFilter): Promise<WorkPackage[]> {
    const {
      startTime,
      endTime,
      registrations,
      namePattern,
      stations,
      statuses,
      areas,
    } = filter;
    const query = this.workPackageRepository.createQueryBuilder('wp');

    // Always-true condition to allow optional filtering
    query.where('1 = 1');

    if (startTime) {
      query.andWhere(`wp.end_time > :startTime`, {
        startTime: new Date(startTime),
      });
    }

    if (endTime) {
      query.andWhere(`wp.start_time < :endTime`, {
        endTime: new Date(endTime),
      });
    }

    if (registrations && registrations.length > 0) {
      query.andWhere('wp.registration IN (:...registrations)', {
        registrations,
      });
    }

    if (namePattern) {
      query.andWhere('wp.name LIKE :namePattern', {
        namePattern: `%${namePattern}%`,
      });
    }

    if (stations && stations.length > 0) {
      query.andWhere('wp.station IN (:...stations)', { stations });
    }

    if (statuses && statuses.length > 0) {
      query.andWhere('wp.status IN (:...statuses)', { statuses });
    }

    if (areas && areas.length > 0) {
      query.andWhere('wp.area IN (:...areas)', { areas });
    }

    return query.getMany();
  }
}
