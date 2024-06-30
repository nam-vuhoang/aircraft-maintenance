import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkPackage } from './work-package.entity';

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

  async findOne(id: number): Promise<WorkPackage> {
    const workPackage = await this.workPackageRepository.findOne({
      where: { id },
    });
    if (!workPackage) {
      throw new NotFoundException(`WorkPackage with ID ${id} not found`);
    }
    return workPackage;
  }

  async update(id: number, workPackage: WorkPackage): Promise<WorkPackage> {
    await this.workPackageRepository.update(id, workPackage);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.workPackageRepository.delete(id);
  }
}
