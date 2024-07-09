import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkPackageService } from './work-package.service';
import { WorkPackage } from './work-package.entity';
import { WorkPackageFilter } from './work-package-filter.dto';
import { NotFoundException } from '@nestjs/common';

const mockWorkPackageRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('WorkPackageService', () => {
  let service: WorkPackageService;
  let repository: MockRepository<WorkPackage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkPackageService,
        {
          provide: getRepositoryToken(WorkPackage),
          useValue: mockWorkPackageRepository(),
        },
      ],
    }).compile();

    service = module.get<WorkPackageService>(WorkPackageService);
    repository = module.get<MockRepository<WorkPackage>>(
      getRepositoryToken(WorkPackage),
    );
  });

  describe('create', () => {
    it('should create a work package', async () => {
      const workPackage = new WorkPackage();
      repository.save.mockResolvedValue(workPackage);

      const result = await service.create(workPackage);
      expect(result).toEqual(workPackage);
      expect(repository.save).toHaveBeenCalledWith(workPackage);
    });
  });

  describe('createAll', () => {
    it('should create multiple work packages', async () => {
      const workPackages = [new WorkPackage(), new WorkPackage()];
      repository.save.mockResolvedValue(workPackages);

      const result = await service.createAll(workPackages);
      expect(result).toEqual(workPackages);
      expect(repository.save).toHaveBeenCalledWith(workPackages);
    });
  });

  describe('findAll', () => {
    it('should find all work packages', async () => {
      const workPackages = [new WorkPackage(), new WorkPackage()];
      repository.find.mockResolvedValue(workPackages);

      const result = await service.findAll();
      expect(result).toEqual(workPackages);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a work package by ID', async () => {
      const workPackage = new WorkPackage();
      repository.findOne.mockResolvedValue(workPackage);

      const result = await service.findOne('1');
      expect(result).toEqual(workPackage);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if work package not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('update', () => {
    it('should update a work package by ID', async () => {
      const workPackage = new WorkPackage();
      repository.update.mockResolvedValue(null);
      repository.findOne.mockResolvedValue(workPackage);

      const result = await service.update('1', workPackage);
      expect(result).toEqual(workPackage);
      expect(repository.update).toHaveBeenCalledWith('1', workPackage);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if work package not found for update', async () => {
      const workPackage = new WorkPackage();
      repository.update.mockResolvedValue(null);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('1', workPackage)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.update).toHaveBeenCalledWith('1', workPackage);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('remove', () => {
    it('should remove a work package by ID', async () => {
      repository.delete.mockResolvedValue(null);

      await service.remove('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('search', () => {
    it('should search work packages with filter', async () => {
      const workPackages = [new WorkPackage(), new WorkPackage()];
      const filter: WorkPackageFilter = {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        registrations: ['N12345'],
        stations: ['JFK'],
        statuses: ['OPEN'],
        areas: ['APRON'],
        namePattern: 'Maintenance%',
        limit: 10,
      };
      const queryBuilder: any = {
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(workPackages),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.search(filter);
      expect(result).toEqual(workPackages);
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(7);
      expect(queryBuilder.limit).toHaveBeenCalledWith(10);
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('getCategoryValues', () => {
    it('should get distinct and sorted values for a category', async () => {
      const values = [{ value: 'OPEN' }, { value: 'CLOSED' }];
      repository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(values),
      });

      const result = await service.getCategoryValues('statuses');
      expect(result).toEqual(['OPEN', 'CLOSED']);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('workPackage');
    });

    it('should throw NotFoundException if category not found', async () => {
      await expect(service.getCategoryValues('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
