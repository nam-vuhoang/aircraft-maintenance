import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkPackageService } from './work-package.service';
import { WorkPackage } from './work-package.entity';
import { NotFoundException } from '@nestjs/common';
import { WorkPackageFilter } from './work-package-filter.dto';

describe('WorkPackageService', () => {
  let service: WorkPackageService;
  let repository: Repository<WorkPackage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkPackageService,
        {
          provide: getRepositoryToken(WorkPackage),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WorkPackageService>(WorkPackageService);
    repository = module.get<Repository<WorkPackage>>(
      getRepositoryToken(WorkPackage),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a work package', async () => {
    const workPackage = new WorkPackage();
    jest.spyOn(repository, 'save').mockResolvedValue(workPackage);
    expect(await service.create(workPackage)).toEqual(workPackage);
  });

  it('should return all work packages', async () => {
    const workPackages = [new WorkPackage(), new WorkPackage()];
    jest.spyOn(repository, 'find').mockResolvedValue(workPackages);
    expect(await service.findAll()).toEqual(workPackages);
  });

  it('should return a work package by ID', async () => {
    const id = '1';
    const workPackage = new WorkPackage();
    jest.spyOn(repository, 'findOne').mockResolvedValue(workPackage);
    expect(await service.findOne(id)).toEqual(workPackage);
  });

  it('should throw an error if work package not found', async () => {
    const id = '1';
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('should update a work package', async () => {
    const id = '1';
    const workPackage = new WorkPackage();
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    jest.spyOn(service, 'findOne').mockResolvedValue(workPackage);
    expect(await service.update(id, workPackage)).toEqual(workPackage);
  });

  it('should delete a work package', async () => {
    const id = '1';
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    await expect(service.remove(id)).resolves.toBeUndefined();
  });

  it('should search work packages with filter', async () => {
    const filter: WorkPackageFilter = { registrations: ['123'] };
    const workPackages = [new WorkPackage()];
    const queryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(workPackages),
    };
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);
    expect(await service.search(filter)).toEqual(workPackages);
  });

  it('should get category values for registrations', async () => {
    const results = [{ value: 'A' }, { value: 'B' }];
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(results),
    } as any);
    expect(await service.getCategoryValues('registrations')).toEqual([
      'A',
      'B',
    ]);
  });

  it('should throw an error for unknown category', async () => {
    await expect(service.getCategoryValues('unknown')).rejects.toThrow(
      NotFoundException,
    );
  });
});
