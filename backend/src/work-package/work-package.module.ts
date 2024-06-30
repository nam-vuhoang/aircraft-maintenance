import { Module } from '@nestjs/common';
import { WorkPackageService } from './work-package.service';
import { WorkPackageController } from './work-package.controller';
import { WorkPackage } from './work-package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WorkPackage])],
  providers: [WorkPackageService],
  controllers: [WorkPackageController],
})
export class WorkPackageModule {}
