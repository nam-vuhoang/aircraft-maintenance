import { Test, TestingModule } from '@nestjs/testing';
import { WorkPackageService } from './work-package.service';

describe('WorkPackageService', () => {
  let service: WorkPackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkPackageService],
    }).compile();

    service = module.get<WorkPackageService>(WorkPackageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
