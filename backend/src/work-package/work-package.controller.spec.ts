import { Test, TestingModule } from '@nestjs/testing';
import { WorkPackageController } from './work-package.controller';
import { WorkPackageService } from './work-package.service';
import { WorkPackage } from './work-package.entity';
import { WorkPackageFilter } from './work-package-filter.dto';
import { WorkPackageImportDto } from './work-package-import.dto';
import { NotFoundException } from '@nestjs/common';

const mockWorkPackageService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  search: jest.fn(),
  createAll: jest.fn(),
  getCategoryValues: jest.fn(),
});

describe('WorkPackageController', () => {
  let controller: WorkPackageController;
  let service: ReturnType<typeof mockWorkPackageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkPackageController],
      providers: [
        {
          provide: WorkPackageService,
          useValue: mockWorkPackageService(),
        },
      ],
    }).compile();

    controller = module.get<WorkPackageController>(WorkPackageController);
    service =
      module.get<ReturnType<typeof mockWorkPackageService>>(WorkPackageService);
  });

  describe('create', () => {
    it('should create a work package', async () => {
      const workPackage = new WorkPackage();
      service.create.mockResolvedValue(workPackage);

      const result = await controller.create(workPackage);
      expect(result).toEqual(workPackage);
      expect(service.create).toHaveBeenCalledWith(workPackage);
    });
  });

  describe('findAll', () => {
    it('should find all work packages', async () => {
      const workPackages = [new WorkPackage(), new WorkPackage()];
      service.findAll.mockResolvedValue(workPackages);

      const result = await controller.findAll();
      expect(result).toEqual(workPackages);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a work package by ID', async () => {
      const workPackage = new WorkPackage();
      service.findOne.mockResolvedValue(workPackage);

      const result = await controller.findOne('1');
      expect(result).toEqual(workPackage);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if work package not found', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a work package by ID', async () => {
      const workPackage = new WorkPackage();
      service.update.mockResolvedValue(workPackage);

      const result = await controller.update('1', workPackage);
      expect(result).toEqual(workPackage);
      expect(service.update).toHaveBeenCalledWith('1', workPackage);
    });

    it('should throw NotFoundException if work package not found for update', async () => {
      service.update.mockResolvedValue(null);

      await expect(controller.update('1', new WorkPackage())).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith('1', expect.any(WorkPackage));
    });
  });

  describe('remove', () => {
    it('should remove a work package by ID', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
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
      service.search.mockResolvedValue(workPackages);

      const result = await controller.search(filter);
      expect(result).toEqual(workPackages);
      expect(service.search).toHaveBeenCalledWith(filter);
    });
  });

  describe('import', () => {
    it('should import work packages from JSON', async () => {
      const importDtos: WorkPackageImportDto[] = [
        Object.assign(new WorkPackageImportDto(), {
          workPackageId: 'WP12345',
          registration: 'ABC123',
          name: 'Maintenance A',
          station: 'HEL',
          status: 'OPEN',
          area: 'APRON',
          startDateTime: '2024-04-16T08:00:00.000Z',
          endDateTime: '2024-04-16T09:30:00.000Z',
        }),
      ];
      const workPackages = importDtos.map((dto) =>
        dto.convertToWorkPackageEntity(),
      );
      service.createAll.mockResolvedValue(workPackages);

      const result = await controller.import(importDtos);
      expect(result).toEqual({ imported: importDtos.length });
      expect(service.createAll).toHaveBeenCalledWith(workPackages);
    });
  });

  describe('getCategoryValues', () => {
    it('should get unique and sorted values for a category', async () => {
      const values = ['OPEN', 'CLOSED'];
      service.getCategoryValues.mockResolvedValue(values);

      const result = await controller.getCategoryValues('statuses');
      expect(result).toEqual(values);
      expect(service.getCategoryValues).toHaveBeenCalledWith('statuses');
    });

    it('should throw NotFoundException if category not found', async () => {
      service.getCategoryValues.mockRejectedValue(
        new NotFoundException('Category not found'),
      );

      await expect(controller.getCategoryValues('unknown')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getCategoryValues).toHaveBeenCalledWith('unknown');
    });
  });
});
