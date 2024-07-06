import { Test, TestingModule } from '@nestjs/testing';
import { WorkPackageController } from './work-package.controller';
import { WorkPackageService } from './work-package.service';
import { WorkPackage } from './work-package.entity';
import { NotFoundException } from '@nestjs/common';
import { WorkPackageFilter } from './work-package-filter.dto';
import { WorkPackageImportDto } from './work-package-import.dto';

describe('WorkPackageController', () => {
  let controller: WorkPackageController;
  let service: WorkPackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkPackageController],
      providers: [
        {
          provide: WorkPackageService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            search: jest.fn(),
            getCategoryValues: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkPackageController>(WorkPackageController);
    service = module.get<WorkPackageService>(WorkPackageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a work package', async () => {
    const workPackage = new WorkPackage();
    jest.spyOn(service, 'create').mockResolvedValue(workPackage);
    expect(await controller.create(workPackage)).toBe(workPackage);
    expect(service.create).toHaveBeenCalledWith(workPackage);
  });

  it('should return all work packages', async () => {
    const workPackages = [new WorkPackage(), new WorkPackage()];
    jest.spyOn(service, 'findAll').mockResolvedValue(workPackages);
    expect(await controller.findAll()).toBe(workPackages);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a work package by ID', async () => {
    const id = '1';
    const workPackage = new WorkPackage();
    jest.spyOn(service, 'findOne').mockResolvedValue(workPackage);
    expect(await controller.findOne(id)).toBe(workPackage);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should throw an error if work package not found', async () => {
    const id = '1';
    jest.spyOn(service, 'findOne').mockResolvedValue(null);
    await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('should update a work package', async () => {
    const id = '1';
    const workPackage = new WorkPackage();
    jest.spyOn(service, 'update').mockResolvedValue(workPackage);
    expect(await controller.update(id, workPackage)).toBe(workPackage);
    expect(service.update).toHaveBeenCalledWith(id, workPackage);
  });

  it('should delete a work package', async () => {
    const id = '1';
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);
    await expect(controller.remove(id)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(id);
  });

  it('should search work packages with filter', async () => {
    const filter: WorkPackageFilter = { registrations: ['123'] };
    const workPackages = [new WorkPackage()];
    jest.spyOn(service, 'search').mockResolvedValue(workPackages);
    expect(await controller.search(filter)).toBe(workPackages);
    expect(service.search).toHaveBeenCalledWith(filter);
  });

  it('should import work packages', async () => {
    const importWorkPackagesDto: WorkPackageImportDto[] = [
      {
        workPackageId: 'WP12345',
        registration: 'ABC123',
        name: 'Maintenance A',
        station: 'HEL',
        status: 'OPEN',
        area: 'APRON',
        startDateTime: '2024-04-16T08:00:00.000Z',
        endDateTime: '2024-04-16T09:30:00.000Z',
        convertToWorkPackageEntity: function (): WorkPackage {
          const workPackage = new WorkPackage();
          workPackage.id = this.workPackageId;
          workPackage.registration = this.registration;
          workPackage.name = this.name;
          workPackage.station = this.station;
          workPackage.status = this.status;
          workPackage.area = this.area;
          workPackage.startTime = new Date(this.startDateTime);
          workPackage.endTime = new Date(this.endDateTime);
          return workPackage;
        },
      },
    ];

    jest.spyOn(service, 'create').mockResolvedValue(new WorkPackage());
    const result = await controller.import(importWorkPackagesDto);

    expect(result).toEqual({ imported: importWorkPackagesDto.length });
    expect(service.create).toHaveBeenCalledTimes(importWorkPackagesDto.length);
    importWorkPackagesDto.forEach((dto) => {
      expect(service.create).toHaveBeenCalledWith(
        dto.convertToWorkPackageEntity(),
      );
    });
  });

  it('should get category values', async () => {
    const category = 'registrations';
    const values = ['A', 'B'];
    jest.spyOn(service, 'getCategoryValues').mockResolvedValue(values);
    expect(await controller.getCategoryValues(category)).toBe(values);
    expect(service.getCategoryValues).toHaveBeenCalledWith(category);
  });

  it('should throw an error for unknown category', async () => {
    const category = 'unknown';
    jest
      .spyOn(service, 'getCategoryValues')
      .mockRejectedValue(new NotFoundException());
    await expect(controller.getCategoryValues(category)).rejects.toThrow(
      NotFoundException,
    );
  });
});
