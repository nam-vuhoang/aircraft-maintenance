import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkPackage } from './work-package.entity';

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
      throw new NotFoundException(`Work package with ID ${id} not found`);
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
      throw new NotFoundException(`Work package with ID ${id} not found`);
    }
  }

  async findOverlapping(
    startTime: Date,
    endTime: Date,
  ): Promise<WorkPackage[]> {
    return this.workPackageRepository
      .createQueryBuilder('workPackage')
      .where(
        'workPackage.startTime < :endTime AND workPackage.endTime > :startTime',
        { startTime, endTime },
      )
      .getMany();
  }
}
