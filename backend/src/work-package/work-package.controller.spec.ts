import { Test, TestingModule } from '@nestjs/testing';
import { WorkPackageController } from './work-package.controller';

describe('WorkPackageController', () => {
  let controller: WorkPackageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkPackageController],
    }).compile();

    controller = module.get<WorkPackageController>(WorkPackageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
